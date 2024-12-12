import { IExecutionResult } from '@/types/ia';
import dayjs from 'dayjs';

interface IHistoryCardProps {
  history: IExecutionResult;
}

export const HistoryCard = ({ history }: IHistoryCardProps) => {
  const start = dayjs(history.start_time);
  const end = dayjs(history.end_time);
  const duration = end.diff(start, 'milliseconds');

  return (
    <div
      className={`p-3 rounded-lg ${
        history.status === 'success'
          ? 'bg-green-100 dark:bg-green-900/20'
          : 'bg-red-100 dark:bg-red-900/20'
      }`}
    >
      <div className='flex justify-between items-center'>
        <span className='text-sm'>
          {dayjs(history.start_time).format('MM/DD/YYYY HH:mm')}
        </span>
        <span
          className={`text-sm font-medium ${
            history.status === 'success'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {history.status}
        </span>
      </div>
      <div className='text-sm mt-1'>
        <span>Duration: {duration}ms</span>
        <span className='mx-2'>•</span>
        <span>Processed: {history.item_count}</span>
        <span className='mx-2'>•</span>
        <span>Failed: {history.failed_item_count}</span>
      </div>
    </div>
  );
};
