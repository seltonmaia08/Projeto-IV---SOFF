import { useEffect, useState } from 'react'
import { toDoListService } from '../Services/api'

export const useTasks = (idDepartment) => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchTask = async () => {

        if(!idDepartment) return 

        try {
            setLoading(true)
            
            const data = await toDoListService.getAllColumn('idDepartment', idDepartment)
            
            setTasks(data)

        } catch (err) {
            setError(err)
            console.error('Erro ao buscar as tarefas', err)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTask()
    }, [idDepartment])

    return { tasks, loading, error, refetch: fetchTask}
}