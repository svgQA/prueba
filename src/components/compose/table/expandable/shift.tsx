import { type FunctionComponent } from 'preact';
import { IExpandableProps } from './interface';
import { ShiftSection } from './component/shift.card';

export const ExpandableShift: FunctionComponent<IExpandableProps> = ({
  row,
}: IExpandableProps) => {
  return (
    <div className='w-full'>
      <div className='flex flex-col lg:flex-row gap-4 lg:gap-8 justify-between'>
        <ShiftSection
          title='Inicio del Turno'
          data={row.checkIn}
          isCheckIn={true}
          row={row}
        />
        <div className='w-1 h-80 bg-b-light-dark dark:bg-b-dark-light' />
        <ShiftSection
          title='Finalización del Turno'
          data={row.checkOut}
          isCheckIn={false}
          row={row}
        />
      </div>
    </div>
  );
};
