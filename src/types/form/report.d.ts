import { IOption } from '@/components/common/smart-selector/smart-select';
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
  subtitle?: string;
  description?: string;
  period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  extraData?: extraDataReport;
  startDate?: Date | string;
  endDate?: Date | string;
  companyId?: number;
  createdBy?: any;
  editedBy?: any;
  deletedBy?: any;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

export interface extraDataReport {
  modules: IModuleReport[];
  emails?: string[];
  projects: IOption[];
}

export interface IModuleReport {
  id?: number;
  name: modulesReport;
}

export enum modulesReport {
  Shift = 'Shift',
  Memo = 'Memo',
  Form = 'Form',
}
