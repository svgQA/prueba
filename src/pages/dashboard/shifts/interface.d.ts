import { IOption } from '@/components/common/multi/interface';

export interface FormData {
  start: string;
  end: string;
  status: string;
  type: string;
  userId: string;
  projectId: number;
  placeId: number;
  workstationId: number;
  serviceId: any;
  employeeId: any;
  roundId: number;
  externalId: string;
  keywords: string[];
  task: ITask;
  timeBefore?: number;
}

export interface ITask {
  id?: number;
  hourStart: string;
  description: string;
  name: string;
  companyId?: number;
  formId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy?: string;
  editedBy?: string;
  deletedBy?: string;
}
