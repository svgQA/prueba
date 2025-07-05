import { DayOfWeek } from './type';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { value: 'monday', label: 'monday' },
  { value: 'tuesday', label: 'tuesday' },
  { value: 'wednesday', label: 'wednesday' },
  { value: 'thursday', label: 'thursday' },
  { value: 'friday', label: 'friday' },
  { value: 'saturday', label: 'saturday' },
  { value: 'sunday', label: 'sunday' },
];

export const START_HOUR = 0;
export const END_HOUR = 24;

export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);
