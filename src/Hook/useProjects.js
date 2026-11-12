import { useEffect, useState, useCallback } from "react";
import { projectService } from "../Services/api";
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
        try{
            setLoading(true)
            const { data, error } = await supabase
                .from('Project')
                .select('*')
                .eq('idUser', user.id)

            if (error) throw error;
            setProjects(Array.isArray(data) ? data : []);
        } catch (err){
            setError(err)
            console.error('Erro ao buscar os projetos...', err)
            setProjects([])
        } finally{
            setLoading(false)
        }

        console.log('Objeto User:', JSON.stringify(user, null, 2));
    },  [user?.id]);


    useEffect(() => {
        if (user?.id) {
            fetchProjects();
        }
    }, [user?.id, fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects }
}