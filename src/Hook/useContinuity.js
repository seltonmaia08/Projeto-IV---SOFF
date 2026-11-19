import { useEffect, useState, useCallback } from 'react'
import { continuityService } from '../Services/api'

export const useContinuity = (idProject) => {
    const [continuity, setContinuity] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchContinuity = useCallback(async () => {
        if(!idProject) {
            setContinuity([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await continuityService.getAllColumn('idProject', idProject);
            setContinuity(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err);
            console.error('Erro ao buscar notas de continuidade: ', err);
            setContinuity([]);
        } finally {
            setLoading(false);
        }
    }, [idProject]);

    useEffect(() => {
        fetchContinuity();
    }, [fetchContinuity]);

    return { continuity: Array.isArray(continuity) ? continuity : [], loading, error, refetch: fetchContinuity }
}