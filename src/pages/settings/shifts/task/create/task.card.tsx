import { ITask } from './interface';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { TextEllipsis } from '@/components/common/text-ellipsis';

interface Props {
  task: ITask;
  remove?: boolean;
  state?: boolean;
}

export const TaskCard = ({ task, remove = true, state = false }: Props) => {
  const { t } = useTranslation();
  return (
    <li className='w-52 text-xs p-2 rounded-bl-2xl bg-b-light-dark dark:bg-b-dark-dark min-w-[150px] relative max-h-[80px]'>
      {remove && (
        <span
          data-id={task.id}
          className='vx-icon vx-icon-335 cursor-pointer absolute top-0 right-1 size-sm'
        ></span>
      )}
      <span className='absolute top-0 left-0 px-2 py-0.5 bg-ternary rounded-br-md'>
        {t(
          typeof task?.type === 'string'
            ? task?.type
            : (task?.type?.value as string)
        )}
      </span>
      <div className='flex flex-row justify-between mt-4'>
        <TextEllipsis text={task.name} className='text-primary' />
        <p>{DateUtils.dateToFrontend(task.hourStart, { format: 'hh:mm A' })}</p>
      </div>
      <div className='flex flex-row justify-between'>
        <TextEllipsis text={task.description} />
        {state && (
          <span
            className={`vx-icon ${task.check ? 'vx-icon-037 text-green-400' : 'vx-icon-033 text-red-400'}`}
          ></span>
        )}
      </div>
    </li>
  );
};
