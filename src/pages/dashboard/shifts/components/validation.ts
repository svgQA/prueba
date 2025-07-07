import dayjs from 'dayjs';
import { DaySchedule, Schedule, TimeBlock } from './types';
import { DAYS_OF_WEEK } from '@/pages/settings/shifts/schedule/constant';

export const isStartAndEndInSchedules = (
  startDateStr: string,
  endDateStr: string,
  currentSchedule: Schedule
): boolean => {
  const start = dayjs.utc(startDateStr);
  const end = dayjs.utc(endDateStr);

  const checkTime = (date: dayjs.Dayjs) => {
    const dayIndex = date.day();
    const dayName = DAYS_OF_WEEK.find((day) => day.position === dayIndex);
    if (
      !currentSchedule.daysAllowed.some(
        (d) => d.toLowerCase() === (dayName?.value || '').toLowerCase()
      )
    ) {
      return false;
    }

    const scheduleDay = currentSchedule.days.find(
      (d: DaySchedule) => d.dayIndex === dayIndex
    );
    if (!scheduleDay) return false;
    const hourDecimal = date.hour() + date.minute() / 60;
    return scheduleDay.blocks.some(
      (block: TimeBlock) =>
        hourDecimal >= block.start && hourDecimal <= block.end
    );
  };

  return checkTime(start) && checkTime(end);
};
