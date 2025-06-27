import { FunctionComponent } from 'preact';

interface Block {
  start: number;
  end: number;
}

export interface DaySelection {
  day: string;
  dayIndex: number;
  blocks: Block[];
}

interface DataScheduleProps {
  daySelection: DaySelection;
}

export const DataSchedule: FunctionComponent<DataScheduleProps> = ({
  daySelection,
}) => {
  return (
    <li
      key={daySelection.day}
      className={`p-3 rounded-md border bg-b-light-dark dark:bg-b-dark-dark  border-b-light-light dark:border-b-dark-light ${
        daySelection?.blocks?.length > 0 ? 'bg-muted/30' : ''
      } min-w-[150px]`}
    >
      <strong className='text-primary block mb-1'>{daySelection.day}:</strong>
      {daySelection?.blocks?.length === 0 ? (
        <span className='text-muted-foreground text-sm italic'>Sin horas</span>
      ) : (
        <div className='space-y-1'>
          {daySelection?.blocks?.map((block) => (
            <span
              key={`${daySelection.day}-${block.start}-${block.end}`}
              className='block text-sm'
            >
              {block.start}:00 - {block.end}:00
            </span>
          ))}
        </div>
      )}
    </li>
  );
};
