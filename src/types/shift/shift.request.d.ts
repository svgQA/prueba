export interface IDay {
  day: DayOfWeek;
  dayIndex: number;
  blocks: IBlock[];
}

export interface IBlock {
  start: number;
  end: number;
}

export interface ISchedule {
  id: number;
  name: string;
  daysAllowed: string[];
  days: IDay[];
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export interface ICScheduleRequest extends ISchedule {
  id?: number;
}

export interface ICheckRequest {
  latitude: string;
  longitude: string;
  date: string;
  platform: string;
  type: string;
  file?: {
    name: string;
    type: string;
    uuid: string;
  };
}

export type IUScheduleRequest = Partial<ICScheduleRequest>;
