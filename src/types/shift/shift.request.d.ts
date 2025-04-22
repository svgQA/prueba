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

export type IUScheduleRequest = Partial<ICScheduleRequest>;
