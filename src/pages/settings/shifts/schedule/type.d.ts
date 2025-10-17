import { IBlock } from '@/types/shift/shift.request';

export type DayOfWeek = {
  value: string;
  label: string;
  position: number;
};

export type DaySelectedModel = {
  day: DayOfWeek;
  dayIndex: number;
  blocks: IBlock[];
};
