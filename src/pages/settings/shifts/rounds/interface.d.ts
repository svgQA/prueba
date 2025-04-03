import { ITask } from "@/types/shift/activity";

export interface IPointMap {
  id: number;
  position: { lat: number; lng: number };
  tasks: ITask[];
}
