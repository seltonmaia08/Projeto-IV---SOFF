import { createContext, useContext } from "react";

export const ProjectContext = createContext(null)

export const useProjectContext = () => {
    const context = useContext(ProjectContext)
    if(!context){
        throw new Error('UseProjectContext most be used within a ProjectRoutes')
    }

    return context
}