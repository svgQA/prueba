import { IDay } from '@/types/shift/shift.request';
import { FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';

interface DataScheduleProps {
  daySelection: IDay;
}

export const DataSchedule: FunctionComponent<DataScheduleProps> = ({
  daySelection,
}) => {
  const { t } = useTranslation();
  return (
    <li
      key={daySelection.day.value}
      className={`text-xs p-2 rounded-md border bg-b-light-dark dark:bg-b-dark-dark  border-b-light-light dark:border-b-dark-light ${
        daySelection?.blocks?.length > 0 ? 'bg-muted/30' : ''
      } min-w-[150px]`}
    >
      <strong className='text-primary block mb-1'>
        {t(daySelection.day.label)}:
      </strong>
      {daySelection?.blocks?.length === 0 ? (
        <span className='text-muted-foreground text-sm italic'>Sin horas</span>
      ) : (
        <div className='space-y-1'>
          {daySelection?.blocks?.map((block) => (
            <span
              key={`${daySelection.day}-${block.start}-${block.end}`}
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
