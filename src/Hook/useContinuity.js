import { useEffect, useState } from 'react'
import { continuityService } from '../Services/api'

export const useContinuity = (idProject) => {
    const [continuity, setContinuity] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchContinuity = async () => {
        if(!idProject) return

        try {
            setLoading(true)
            const data = await continuityService.getAllColumn('idProject', idProject)

            setContinuity(data)
        } catch (err) {
            setError(err)
            console.error('Erro ao buscar as anotações: ', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContinuity()
    }, [idProject])

    return { continuity, loading, error, refetch: fetchContinuity }
}