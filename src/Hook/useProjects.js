import { useEffect, useState } from "react";
import { projectService } from "../Services/api";

export const useProject = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProjects = async () => {
        try{
            setLoading(true)
            const data = await projectService.getAll()
            setProjects(data)
        } catch (err){
            setError(err)
            console.error('Erro ao buscar os projetos...', err)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    return { projects, loading, error, refetch: fetchProjects }
}