import { BaseServices } from "./BaseServices";

export const callService = BaseServices('Call')
export const continuityService = BaseServices('Continuity')
export const departmentService = BaseServices('Department')
export const notesService = BaseServices('Notes')
export const projectService = BaseServices('Project')
export const projectMemberService = BaseServices('ProjectMember')
export const reminderService = BaseServices('Reminder')
export const scenesListService = BaseServices('ScenesList')
export const toDoListService = BaseServices('ToDoList')
export const userService = BaseServices('User')


console.log(userService.getAll())