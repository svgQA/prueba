import { useEffect, useState } from 'preact/hooks';
import { Badge } from '@/components/common/badge/badge';
import { Gauge } from '@/components/common/gauge/gauge';
import { formatDate } from './contract.expandable';
import { TaskItemShift } from '@/types/shift/activity';
import { useTranslation } from 'react-i18next';
import { TaskCard } from '@/pages/settings/shifts/task/create/task.card';

interface Props {
  shiftId: number;
  tasks: TaskItemShift[];
}

const TaskInfo = ({ shiftId, tasks }: Props) => {
  const { t } = useTranslation();
  const [grouped, setGrouped] = useState<Record<string, TaskItemShift[]>>({});
  const [overallProgress, setOverallProgress] = useState<number>(0);

  useEffect(() => {
    const groupByDate = tasks.reduce(
      (acc, task) => {
        const date = task.hourStart?.split('T')[0] ?? 'Sin fecha';
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
        return acc;
      },
      {} as Record<string, TaskItemShift[]>
    );

    setGrouped(groupByDate);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.check).length;
    setOverallProgress(total > 0 ? (completed / total) * 100 : 0);
  }, [tasks]);

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm text-t-light dark:text-t-dark py-2 px-4 relative'>
      <div className='flex items-center justify-between absolute top-0 right-0 w-full'>
        <h2 className='font-medium p-2 bg-ternary text-white rounded-ee-lg'>
          {t('h_task')}
        </h2>
      </div>

      {Object.entries(grouped).length === 0 ? (
        <div className='flex items-center justify-center h-32'>
          <p className='text-gray-500 dark:text-gray-400'>{t('empty')}</p>
        </div>
      ) : (
        <div className='flex flex-row gap-6 justify-start overflow-x-auto px-2 pb-4 w-full'>
          {Object.entries(grouped).map(([date, list], idx) => {
            const completed = list.filter((t) => t.check).length;
            const total = list.length;

            return (
              <div
                key={`task-info-${idx}-${shiftId}`}
                className='flex flex-col p-8 w-full '
              >
                <div className='flex flex-row justify-between items-center mb-3 px-1'>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>
                    {completed} / {total} {t('l_completed')}
                  </div>
                  <Badge label={formatDate(date)} status='info' />
                </div>

                <div className='flex flex-row gap-2 w-full'>
                  <div className='flex flex-row gap-1 flex-wrap w-3/4 justify-center items-center'>
                    {list.map((task: any, i) => (
                      <TaskCard
                        task={task}
                        key={`task-selected-${i}`}
                        remove={false}
                        state
                      />
                    ))}
                  </div>
                  <div
                    className='flex flex-col justify-center items-center px-3 py-2 rounded-md border w-1/4
                                  border-gray-200 dark:border-b-dark-dark
                                  bg-gray-50 dark:bg-b-dark text-gray-700 dark:text-gray-300'
                  >
                    <Gauge progress={overallProgress} size={20} color='teal' />
                    <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 text-center'>
                      {t('l_overall')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskInfo;
