import { IBlock } from '@/types/shift/shift.request';

export type DayOfWeek = {
  value: string;
  label: string;
};

export type DaySelectedModel = {
  day: DayOfWeek;
  dayIndex: number;
  blocks: IBlock[];
};
