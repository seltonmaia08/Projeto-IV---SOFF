import { BaseServices } from "./BaseServices";

export const callService = BaseServices('call')
export const continuityService = BaseServices('continuity')
export const departmentService = BaseServices('department')
export const notesService = BaseServices('notes')
export const projectService = BaseServices('project')
export const projectMemberService = BaseServices('projectMember')
export const reminderService = BaseServices('reminder')
export const scenesListService = BaseServices('scenesList')
export const userService = BaseServices('user')
export const toDoListService = BaseServices('toDoList')


console.log(userService.getAll())