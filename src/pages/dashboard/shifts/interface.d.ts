import { IOption } from '@/components/common/multi/interface';
import { Task } from '@/components/compose/gantt';

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
  scheduleId: any;
  roundId: number;
  externalId: string;
  keywords: string[];
  task: IOption;
  timeBefore?: number;
}

export interface IShiftRequest extends FormData {
  task?: ITask;
}
