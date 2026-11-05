import { useEffect, useState } from 'react'
import { reminderService } from '../Services/api'

export const useNotification = (idProject) => {
    const [notification, setNotification] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchNotification = async () => {
        if(!idProject) return

        try {
            setLoading(true)
            const data = await reminderService.getAllColumn('idProject', idProject)

            setNotification(data)
        } catch (err) {
            setError(err)
            console.error('Erro ao buscar as anotações: ', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotification()
    }, [idProject])

    return { notification, loading, error, refetch: fetchNotification }
}