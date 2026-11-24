import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";
import { supabase } from "../Utils/Supabase";

export const useProject = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const { user } = useAuth()

    const fetchProjects = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true)

            // 1. Projetos que ele criou
            const { data: criados, error: err1 } = await supabase
                .from('Project')
                .select('*')
                .eq('idUser', user.id)

            if (err1) throw err1

            // 2. IDs dos projetos que ele entrou como membro
            const { data: membros, error: err2 } = await supabase
                .from('ProjectMember')
                .select('idProject')
                .eq('idUser', user.id)

            if (err2) throw err2

            // 3. Busca dados completos dos projetos ingressados (sem duplicatas)
            const idsIngressados = Array.from(new Set(
                membros
                    .map(m => m.idProject)
                    .filter(id => id && !criados.some(p => p.idProject === id))
            ))

            let ingressados = []
            if (idsIngressados.length > 0) {
                const { data: dadosIngressados, error: err3 } = await supabase
                    .from('Project')
                    .select('*')
                    .in('idProject', idsIngressados)

                if (err3) throw err3
                ingressados = dadosIngressados ?? []
            }

            setProjects([...criados, ...ingressados])
        } catch (err) {
            setError(err)
            console.error('Erro ao buscar os projetos...', err)
            setProjects([])
        } finally {
            setLoading(false)
        }
    }, [user?.id]);


    useEffect(() => {
        if (user?.id) {
            fetchProjects();
        }
    }, [user?.id, fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects }
}
