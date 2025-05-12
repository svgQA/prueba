export interface ICScheduleRequest {
  id?: number;
  name: string;
  daysAllowed: string[];
  days: IDay[];
}

export interface IDay {
  day: string;
  dayIndex: number;
  blocks: IBlock[];
}

export interface IBlock {
  start: number;
  end: number;
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
