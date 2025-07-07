import { DayOfWeek } from './type';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  { value: 'monday', label: 'monday', position: 1 },
  { value: 'tuesday', label: 'tuesday', position: 2 },
  { value: 'wednesday', label: 'wednesday', position: 3 },
  { value: 'thursday', label: 'thursday', position: 4 },
  { value: 'friday', label: 'friday', position: 5 },
  { value: 'saturday', label: 'saturday', position: 6 },
  { value: 'sunday', label: 'sunday', position: 0 },
];

export const START_HOUR = 0;
export const END_HOUR = 24;

export const HOURS = Array.from(
  { length: END_HOUR - START_HOUR + 1 },
  (_, i) => START_HOUR + i
);
