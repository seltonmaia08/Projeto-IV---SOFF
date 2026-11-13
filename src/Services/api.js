import { BaseServices } from "./BaseServices";
import { supabase } from "../Utils/Supabase";

export const callService = BaseServices('Call');
export const continuityService = BaseServices('Continuity');
export const departmentService = BaseServices('Department');
export const notesService = BaseServices('Notes');

export const projectService = {
    ...BaseServices('Project'),
    async delete(id) {
        // Remove primeiro os registros dependentes nas tabelas filhas para evitar erro de Foreign Key
        const childTables = [
            'ProjectMember',
            'ScenesList',
            'Continuity',
            'Notes',
            'Reminder',
            'ToDoList',
            'Call'
        ];

        for (const table of childTables) {
            try {
                await supabase.from(table).delete().eq('idProject', id);
            } catch (e) {
                console.warn(`Aviso ao limpar ${table}:`, e);
            }
        }

        // Deleta o projeto principal
        const { data, error } = await supabase
            .from('Project')
            .delete()
            .eq('idProject', id)
            .select();

        if (error) throw error;
        return true;
    }
};

export const projectMemberService = BaseServices('ProjectMember');
export const reminderService = BaseServices('Reminder');
export const scenesListService = BaseServices('ScenesList');
export const toDoListService = BaseServices('ToDoList');
export const profilesService = BaseServices('Profiles');
