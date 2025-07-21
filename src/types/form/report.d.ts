import { IPresignedRequest } from '../file';

// export interface IReport {
//   id?: number;
//   title: string;
//   description?: string;

//   header: boolean;
//   footer: boolean;
//   pageBreak: boolean;
//   flaggedItems: boolean;
//   actions: boolean;
//   disclaimer: boolean;
//   mediaSummary: boolean;
//   pdfSize: string;
//   thumbnailSize: string;

//   coverPage?: IPresignedRequest;
//   logoPage?: IPresignedRequest;
//   formId?: number;
// }

export interface IReport {
  id?: number;
  title: string;
  description?: string;
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  extraData?: any;
  companyId: number;
  createdBy?: any;
  editedBy?: any;
  deletedBy?: any;
}

export interface extraDataReport {
  modules: IModuleReport[];
  emails: string[];
  projects: IProjectsReport[];
}

export interface IModuleReport {
  id?: number;
  name: string;
}

export interface IProjectsReport {
  id: number;
  name: string;
  description: string;
}