import { ITask } from './interface';
import { useTranslation } from 'react-i18next';
import { DateUtils } from '@/utils/utilities/dates';
import { TextEllipsis } from '@/components/common/text-ellipsis';

interface Props {
  task: ITask;
  remove?: boolean;
  state?: boolean;
  whidt?: string;
  onDelete?: (id: any) => void;
}

export const TaskCard = ({
  task,
  remove = true,
  state = false,
  onDelete,
  whidt,
}: Props) => {
  const { t } = useTranslation();
  if (!task.id || !task.name) return null;
  return (
    <li className='w-52 text-xs p-2 rounded-bl-2xl bg-b-light-dark dark:bg-b-dark-dark min-w-[150px] relative max-h-[80px] list-none'>
      <div className='absolute top-0 left-0 flex w-full justify-between'>
        <span className='px-2 py-0.5 bg-ternary rounded-br-md'>
          {t(
            typeof task?.type === 'string'
              ? task?.type
              : (task?.type?.value as string)
          )}
        </span>
        <span className='text-white'>{task.attachmentType}</span>
        {remove && onDelete && (
          <span
            data-id={task.id}
            className='vx-icon vx-icon-335 cursor-pointer size-sm px-1'
            onClick={() => onDelete && onDelete(task.id)}
          ></span>
        )}
      </div>
      <div className='flex flex-row justify-between mt-5'>
        <TextEllipsis
          text={task.name}
          className='text-primary'
          maxWidth={whidt}
        />
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
