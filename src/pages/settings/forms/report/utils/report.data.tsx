import { IModuleReport, IProjectsReport } from "@/types/form";

export const periodOptions = [
    { label: 'DAILY', value: 1},
    { label: 'WEEKLY', value: 2 },
    { label: 'MONTHLY', value: 3 },
    { label: 'QUARTERLY', value: 4 },
    { label: 'YEARLY', value: 5 },
];

export const reportModuleOptions: IModuleReport[] = [
    { id: 1, name: 'form' },
    { id: 2, name: 'shift' },
    { id: 3, name: 'memo' },
];

export const reportProjectOptions: IProjectsReport[] = [
    { id: 1, name: 'Project 1', description: 'project1' },
    { id: 2, name: 'Project 2', description: 'project2' },
    { id: 3, name: 'Project 3', description: 'project3' },
];