import { IDay } from '@/types/shift/shift.request';
import { FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';
import { DayOfWeek } from '../type';

interface DataScheduleProps {
  daySelection: IDay;
}

export const DataSchedule: FunctionComponent<DataScheduleProps> = ({
  daySelection,
}) => {
  const { t } = useTranslation();
  return (
    <li
      key={(daySelection.day as DayOfWeek).value}
      className={`text-xs p-2 rounded-md border bg-b-light-dark dark:bg-b-dark-dark  border-b-light-light dark:border-b-dark-light max-h-[90px] overflow-hidden ${
        daySelection?.blocks?.length > 0 ? 'bg-muted/30' : ''
      } min-w-[150px]`}
    >
      <strong className='text-primary block mb-1'>
        {t((daySelection.day as DayOfWeek).label)}:
      </strong>
      {daySelection?.blocks?.length === 0 ? (
        <span className='text-muted-foreground text-sm italic'>
          {t('l_no_hours')}
        </span>
      ) : (
        <div className='space-y-1'>
          {daySelection?.blocks?.map((block) => (
            <span
              key={`${(daySelection.day as DayOfWeek).value}-${block.start}-${block.end}`}
              className='block text-xs'
            >
              {block.start}:00 - {block.end}:00
            </span>
          ))}
        </div>
      )}
    </li>
  );
};
