import { IOption } from '@/components/common/interface';
import { IFormat } from './form';
import { extraDataReport, IModuleReport, IReport, modulesReport, ReportPeriod } from './report';
import { RESPONSE_STATUS } from './form.enum';

export interface IFormRequest {
  title: string;
  structure: IFormat;
  description: string;
  category?: string;
  report?: { id: number };
  smart_groups?: number[];
}

export interface IFormResponse extends IFormRequest {
  id: number;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  groups: IGroups[];
}

interface IGroups {
  group: {
    id: number;
    name: string;
  };
}

export interface UResponseRequest extends Omit<IResponseRequest, 'formId'> {}

export interface IListRequest {
  name: string;
  structure: IOption[];
}

export interface IListResponse extends IListRequest {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IReportRequest extends IReport {}

export interface IReportResponse extends IReportRequest {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IResponseRequest {
  formId: number;
  structure: IFormat;
}

// TODO: Corregir estas interfaces en form y user
export interface IResponseResponse extends IResponseRequest {
  id: string;
  user: any;
  form: any;
  status: RESPONSE_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IExcelGenerateRequest {
  mod: modulesReport;
  startDate: Date | string;
  endDate: Date | string;
}

export interface ICReportAiRequest {
  title: string;
  subtitle?: string;
  description?: string;
  period?: ReportPeriod;
  extraData?: extraDataReport;
  startDate?: Date | string;
  endDate?: Date | string;
  user?: IOption;
  sendEmail?: boolean;
  priority?: IOption;
}
