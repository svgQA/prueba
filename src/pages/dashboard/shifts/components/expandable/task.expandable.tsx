import { useEffect, useState } from 'preact/hooks';
import { Badge } from '@/components/common/badge/badge';
import { Gauge } from '@/components/common/gauge/gauge';
import { formatDate } from './contract.expandable';
import { useTranslation } from 'react-i18next';
import { TaskCard } from '@/pages/settings/shifts/task/create/task.card';
import { FormService } from '@/services';
import {
  setResponse,
  RESPONSE_MODE_SERVICE,
  VIEW_NAME,
  currentView,
} from '@/pages/dashboard/forms/response/store/response';
import { useLocation } from 'wouter';
import { ITask } from '@/pages/settings/shifts/task/create/interface';
interface Props {
  shiftId: number;
  tasks: ITask[];
}

const TaskInfo = ({ shiftId, tasks }: Props) => {
  const { t } = useTranslation();
  const [_, navigate] = useLocation();
  const [grouped, setGrouped] = useState<Record<string, ITask[]>>({});
  const [overallProgress, setOverallProgress] = useState<number>(0);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  useEffect(() => {
    const groupByDate = tasks?.reduce(
      (acc, task) => {
        const date = task.hourStart?.split('T')[0] ?? 'Sin fecha';
        if (!acc[date]) acc[date] = [];
        acc[date].push(task);
        return acc;
      },
      {} as Record<string, ITask[]>
    );

    setGrouped(groupByDate);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.check).length;
    setOverallProgress(total > 0 ? (completed / total) * 100 : 0);
  }, [tasks]);

  const toggleDetailsForm = async (task: ITask) => {
    if (!task.formId || !task.responseId) return;

    // Si ya estaba abierto, lo cerramos
    if (selectedFormId === task.formId) {
      setSelectedFormId(null);
      return;
    }

    const response = await FormService.get_one_response(task.responseId);
    if (response.getStatus()) {
      const structure = response.getOne()?.structure;
      setSelectedFormId(task.formId);

      setResponse(
        {
          mode: RESPONSE_MODE_SERVICE.UPDATE,
          id: task.responseId,
          hold: true,
        },
        structure
      );

      currentView.value = VIEW_NAME.REPORT;
      navigate('/forms');
    }
  };

  return (
    <div className='bg-b-light-light dark:bg-b-dark-light rounded-lg shadow-sm text-t-light dark:text-t-dark relative'>
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
                className='flex flex-col w-full '
              >
                <div className='flex flex-row justify-between items-center mb-3 px-1 ml-14'>
                  <div className='text-xs text-gray-600 dark:text-gray-400'>
                    {completed} / {total} {t('l_completed')}
                  </div>
                  <Badge label={formatDate(date)} status='info' />
                </div>

                <div className='flex flex-row gap-2 w-full'>
                  <div className='flex flex-row gap-1 flex-wrap w-10/12 justify-center items-center'>
                    {list.map((task: ITask, i) => (
                      <div key={`task-selected-${i}`} className='relative'>
                        <TaskCard task={task} remove={false} state />

                        {/* 👇 Ver Formulario si hay responseId */}
                        {task.responseId && task.formId && (
                          <span
                            onClick={() => toggleDetailsForm(task)}
                            className='absolute bottom-2 right-8 text-xs text-primary underline cursor-pointer'
                          >
                            {'Formulario'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div
                    className='flex flex-col justify-center items-center px-3 py-2 rounded-md border w-2/12
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
