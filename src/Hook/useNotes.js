import { useEffect, useState } from 'react'
import { notesService } from '../Services/api'

export const useNotes = (idProject) => {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchNotes = async () => {
        if(!idProject) return

        try {
            setLoading(true)
            const data = await notesService.getAllColumn('idProject', idProject)

            setNotes(data)
        } catch (err) {
            setError(err)
            console.error('Erro ao buscar as anotações: ', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes()
    }, [idProject])

    return { notes, loading, error, refetch: fetchNotes }
}