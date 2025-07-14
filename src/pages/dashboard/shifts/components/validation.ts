import { Dayjs } from 'dayjs';
import { DaySchedule, Schedule, TimeBlock } from './types';
import { DAYS_OF_WEEK } from '@/pages/settings/shifts/schedule/constant';
import { DateUtils } from '@/utils/utilities/dates';

const checkTime = (date: Dayjs, schedule: Schedule) => {
  const day_of_week = date.day();
  const day_name = DAYS_OF_WEEK.find((day) => day.position === day_of_week);
  if (!day_name) return false;

  const _exist_day = schedule.daysAllowed.some((day) => day === day_name.value);
  if (!_exist_day) return false;

  const _schedule_hours = schedule.days.find(
    (d: DaySchedule) => DAYS_OF_WEEK[d.dayIndex]?.position === day_name.position
  )?.blocks;
  if (!_schedule_hours) return false;
  const _hour = date.hour();

  const validation = _schedule_hours.some((block: TimeBlock) => {
    return _hour >= block.start && _hour < block.end;
  });

  return validation;
};

export const isStartAndEndInSchedules = (
  str_start: string,
  str_end: string,
  schedule: Schedule
): boolean => {
  const _start = DateUtils._dateToFrontend(str_start);
  const _end = DateUtils._dateToFrontend(str_end);
  return checkTime(_start, schedule) && checkTime(_end, schedule);
};
