import { GeneralTask, ViewMode } from '../types/public-types';
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;
import DateTimeFormat = Intl.DateTimeFormat;

type DateHelperScales =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

interface IntlDateTimeCache {
  [key: string]: Intl.DateTimeFormat;
}

const intlDTCache: IntlDateTimeCache = {};

export const getCachedDateTimeFormat = (
  locString: string | string[],
  opts: DateTimeFormatOptions = {}
): DateTimeFormat => {
  const key = JSON.stringify([locString, opts]);
  let dtf = intlDTCache[key];
  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locString, opts);
    intlDTCache[key] = dtf;
  }
  return dtf;
};

export const addToDate = (
  date: Date,
  quantity: number,
  scale: DateHelperScales
): Date => {
  const newDate = new Date(
    date.getFullYear() + (scale === 'year' ? quantity : 0),
    date.getMonth() + (scale === 'month' ? quantity : 0),
    date.getDate() + (scale === 'day' ? quantity : 0),
    date.getHours() + (scale === 'hour' ? quantity : 0),
    date.getMinutes() + (scale === 'minute' ? quantity : 0),
    date.getSeconds() + (scale === 'second' ? quantity : 0),
    date.getMilliseconds() + (scale === 'millisecond' ? quantity : 0)
  );
  return newDate;
};

export const startOfDate = (date: Date, scale: DateHelperScales): Date => {
  const scores = [
    'millisecond',
    'second',
    'minute',
    'hour',
    'day',
    'month',
    'year',
  ];

  const shouldReset = (_scale: DateHelperScales): boolean => {
    const maxScore = scores.indexOf(scale);
    return scores.indexOf(_scale) <= maxScore;
  };
  const newDate = new Date(
    date.getFullYear(),
    shouldReset('year') ? 0 : date.getMonth(),
    shouldReset('month') ? 1 : date.getDate(),
    shouldReset('day') ? 0 : date.getHours(),
    shouldReset('hour') ? 0 : date.getMinutes(),
    shouldReset('minute') ? 0 : date.getSeconds(),
    shouldReset('second') ? 0 : date.getMilliseconds()
  );
  return newDate;
};

export const ganttDateRange = (
  tasks: GeneralTask,
  viewMode: ViewMode,
  preStepsCount: number
): [Date, Date] => {
  if (!tasks?.users || tasks?.users?.length === 0)
    return [new Date(tasks.startDate), new Date(tasks.endDate)];

  let newStartDate: Date = new Date(tasks.endDate);
  let newEndDate: Date = new Date(tasks.startDate);

  for (const user of tasks.users) {
    for (const task of user.tasks) {
      if (new Date(task.end) > newEndDate) {
        newEndDate = new Date(task.end);
      }
      if (new Date(task.start) < newStartDate) {
        newStartDate = new Date(task.start);
      }
    }
  }

  switch (viewMode) {
    case ViewMode.Month:
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'month');
      newStartDate = startOfDate(newStartDate, 'month');
      newEndDate = addToDate(newEndDate, 1, 'year');
      newEndDate = startOfDate(newEndDate, 'year');
      break;
    case ViewMode.Week:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(
        getMonday(newStartDate),
        -7 * preStepsCount,
        'day'
      );
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 1.5, 'month');
      break;
    case ViewMode.Day:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 10, 'day');
      break;
    case ViewMode.QuarterDay:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(newStartDate, -10 * preStepsCount, 'hour');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 30, 'hour');
      break;
    case ViewMode.HalfDay:
      newStartDate = startOfDate(newStartDate, 'day');
      newStartDate = addToDate(newStartDate, -1 * preStepsCount, 'day');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 5, 'day');
      break;
    case ViewMode.Year:
      newStartDate = addToDate(newStartDate, -1, 'year');
      newStartDate = startOfDate(newStartDate, 'year');
      newEndDate = addToDate(newEndDate, 1, 'year');
      newEndDate = startOfDate(newEndDate, 'year');
      break;
    case ViewMode.QuarterYear:
      newStartDate = addToDate(newStartDate, -3, 'month');
      newStartDate = startOfDate(newStartDate, 'month');
      newEndDate = addToDate(newEndDate, 3, 'year');
      newEndDate = startOfDate(newEndDate, 'year');
      break;
    case ViewMode.Hour:
      newStartDate = startOfDate(newStartDate, 'hour');
      newStartDate = addToDate(newStartDate, -2 * preStepsCount, 'hour');
      newEndDate = startOfDate(newEndDate, 'day');
      newEndDate = addToDate(newEndDate, 6, 'hour');
      break;
  }
  return [newStartDate, newEndDate];
};

export const seedDates = (
  startDate: Date,
  endDate: Date,
  viewMode: ViewMode
): Date[] => {
  let currentDate: Date = new Date(startDate);
  const dates: Date[] = [currentDate];
  while (currentDate < endDate) {
    switch (viewMode) {
      case ViewMode.Month:
        currentDate = addToDate(currentDate, 1, 'month');
        break;
      case ViewMode.Week:
        currentDate = addToDate(currentDate, 7, 'day');
        break;
      case ViewMode.Day:
        currentDate = addToDate(currentDate, 1, 'day');
        break;
      case ViewMode.HalfDay:
        currentDate = addToDate(currentDate, 12, 'hour');
        break;
      case ViewMode.QuarterDay:
        currentDate = addToDate(currentDate, 6, 'hour');
        break;
      case ViewMode.Hour:
        currentDate = addToDate(currentDate, 1, 'hour');
        break;
      case ViewMode.Year:
        currentDate = addToDate(currentDate, 1, 'year');
        break;
      case ViewMode.QuarterYear:
        currentDate = addToDate(currentDate, 3, 'month');
        break;
    }
    dates.push(currentDate);
  }
  return dates;
};

export const getLocaleMonth = (date: Date, locale: string): string => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    month: 'long',
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

export const getLocalDayOfWeek = (
  date: Date,
  locale: string,
  format?: 'long' | 'short' | 'narrow'
): string => {
  let bottomValue = getCachedDateTimeFormat(locale, {
    weekday: format,
  }).format(date);
  bottomValue = bottomValue.replace(
    bottomValue[0],
    bottomValue[0].toLocaleUpperCase()
  );
  return bottomValue;
};

const getMonday = (date: Date): Date => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

export const getWeekNumberISO8601 = (date: Date): string => {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (tmpDate.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber = (
    1 + Math.ceil((firstThursday - tmpDate.valueOf()) / 604800000)
  ).toString();

  return weekNumber.length === 1 ? `0${weekNumber}` : weekNumber;
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};
