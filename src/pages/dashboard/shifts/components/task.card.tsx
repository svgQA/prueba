import { Badge } from '@/components/common/badge/badge';
import { ITask } from '../interface';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';

export const TaskCard = ({ task }: { task: ITask }) => {
  const { t } = useTranslation();
  return (
    <div
      key={task.id}
      className='dark:bg-b-dark-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-64'
    >
      <div className='flex justify-between items-center mb-3'>
        <h3 className='font-medium text-gray-900 dark:text-white truncate'>
          {task.name}
        </h3>
        <Badge
          label={task.status || 'UNKNOWN'}
          bgColor={
            task.status === 'CLOSED'
              ? 'bg-red-200'
              : task.status === 'CREATED'
                ? 'bg-green-200'
                : 'bg-gray-200'
          }
        />
      </div>

      <div className='space-y-2'>
        <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
          <span>{t('progress')}</span>
          <span>{task.progress || 0}%</span>
        </div>

        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-blue-500 h-2 rounded-full'
            style={{
              width: `${task.progress || 0}%`,
              backgroundColor: task.styles?.progressColor,
            }}
          ></div>
        </div>
        <div className='flex justify-center items-center text-xs text-center text-gray-500 dark:text-gray-400 mt-2 w-full'>
          <div>
            <i className='fas fa-calendar-alt mx-1'></i>
            {DateUtils.dateToFrontend(task.start, { mode: '12' })}
          </div>
          <div>
            <i className='fas fa-flag-checkered mx-1'></i>
            {DateUtils.dateToFrontend(task.end, { mode: '12' })}
          </div>
        </div>
      </div>
    </div>
  );
};
