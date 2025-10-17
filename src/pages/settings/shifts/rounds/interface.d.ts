import { ITask } from '@/types/shift/activity';

export interface IPointMap {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  tasks: ITask[];
}
