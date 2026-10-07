import { useEffect, useState } from 'react'
import { scenesListService } from '../Services/api'

export const useScenes = (idProject) => {
    const [scenes, setScenes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchScenes = async () => {
        if(!idProject) return 

        try {
            setLoading(true)
            
            const data = await scenesListService.getAllColumn('idProject', idProject)
            
            setScenes(data)

        } catch (err) {
            setError(err)
            console.error('Erro ao buscar as cenas', err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchScenes()
    }, [idProject])

    return { scenes, loading, error, refetch: fetchScenes}
}