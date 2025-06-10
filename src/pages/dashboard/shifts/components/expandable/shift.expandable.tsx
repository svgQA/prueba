import { Chip } from '@/components/common/chip/chip';
import { CardRound } from './card.round';
import { ITaskHistory } from '@/types/shift/activity';
import { DateUtils } from '@/utils/utilities/dates';

interface ShiftInfoProps {
  tasks: ITaskHistory[];
  activityPct: number;
  start: string;
  end: string;
}

const ShiftInfo = ({
  tasks = [],
  activityPct = 0,
  start,
  end,
}: ShiftInfoProps) => {
  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm text-t-light dark:text-t-dark p-4 relative'>
      {tasks.length > 0 ? (
        <div>
          <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
            <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
              Actividades del Turno
            </h2>
            <div className='flex flex-row gap-2 flex-wrap justify-end'>
              <Chip label={`Progreso: ${activityPct}%`} color='primary' />
            </div>
          </div>
          <div className='flex flex-row gap-2 flex-wrap justify-center'>
            {tasks.map((task: any, index: number) => (
              <CardRound
                key={index}
                activity={{
                  ...task,
                  serviceTask: {
                    ...task.serviceTask,
                    hourStart: DateUtils.calculateTaskDate(
                      task.serviceTask.hourStart,
                      start,
                      end
                    ),
                  },
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center min-h-[100px]'>
          <p className='text-gray-500'>No hay actividades para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default ShiftInfo;
