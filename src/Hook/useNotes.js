import { useEffect, useState, useCallback } from 'react'
import { notesService } from '../Services/api'
import { supabase } from '../Utils/Supabase'

export const useNotes = (idProject) => {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchNotes = useCallback(async () => {
        if(!idProject) {
            setNotes([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // 1. Busca no Supabase apenas as anotações gerais do projeto (sem vínculo com departamento)
            let data = null;
            let sbError = null;

            try {
                const res = await supabase
                    .from('Notes')
                    .select('*')
                    .eq('idProject', idProject)
                    .is('idDepartment', null)
                    .order('created_at', { ascending: false });

                data = res.data;
                sbError = res.error;

                // Se a coluna 'created_at' não existir, tenta sem ordenação
                if (sbError && sbError.code === '42703' && sbError.message?.includes('created_at')) {
                    const resNoOrder = await supabase
                        .from('Notes')
                        .select('*')
                        .eq('idProject', idProject)
                        .is('idDepartment', null);
                    data = resNoOrder.data;
                    sbError = resNoOrder.error;
                }
            } catch (errReq) {
                sbError = errReq;
            }

            // Se der erro porque a coluna 'idDepartment' não existe no banco, busca por idProject e filtra localmente
            if (sbError && (sbError.code === '42703' || sbError.code === 'PGRST204')) {
                const fallbackData = await notesService.getAllColumn('idProject', idProject);
                data = fallbackData;
                sbError = null;
            }

            if (sbError) {
                throw sbError;
            }

            // 2. Filtro estrito: nunca exibe notas que possuam departamento na tela principal
            const notasGerais = Array.isArray(data)
                ? data.filter(item => !item.idDepartment)
                : [];

            setNotes(notasGerais);
        } catch (err) {
            setError(err);
            console.error('Erro ao buscar as anotações gerais: ', err);
            setNotes([]);
        } finally {
            setLoading(false);
        }
    }, [idProject]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    return { notes: Array.isArray(notes) ? notes : [], loading, error, refetch: fetchNotes }
}
