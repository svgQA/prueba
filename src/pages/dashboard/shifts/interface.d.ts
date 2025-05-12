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
  employeedId: any;
  roundId: number;
  externalId: string;
  keywords: string[];
  tasks: ITask[];
}

export interface ITask {
  start: string;
  status: string;
  description: string;
}
