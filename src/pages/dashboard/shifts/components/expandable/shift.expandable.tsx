import { Chip } from '@/components/common/chip/chip';
import { CardRound } from './card.round';
import dayjs from 'dayjs';
import { ITaskHistory } from '@/types/shift/activity';

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
  const calculateTaskDate = (taskTime: string, start: string, end: string) => {
    const taskHour = dayjs(taskTime).hour();
    const taskMinute = dayjs(taskTime).minute();
    const startDay = dayjs(start);
    const endDay = dayjs(end);

    const startDate = startDay.startOf('day');
    const endDate = endDay.startOf('day');

    if (!startDate.isSame(endDate, 'day')) {
      const startHour = startDay.hour();
      const endHour = endDay.hour();

      if (taskHour >= startHour) {
        return startDay.set('hour', taskHour).set('minute', taskMinute);
      }

      if (taskHour <= endHour) {
        return endDay.set('hour', taskHour).set('minute', taskMinute);
      }
    }

    return startDay.set('hour', taskHour).set('minute', taskMinute);
  };
  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm w-full text-t-light dark:text-t-dark p-4 relative'>
      {tasks.length > 0 ? (
        <div>
          <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
            <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
              Actividades del Turno
            </h2>
            <Chip label={`Progreso: ${activityPct}%`} color='primary' />
          </div>
          <div className='flex flex-row gap-2 flex-wrap justify-center'>
            {tasks.map((task: any, index: number) => (
              <CardRound
                key={index}
                activity={{
                  ...task,
                  serviceTask: {
                    ...task.serviceTask,
                    hourStart: calculateTaskDate(
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
