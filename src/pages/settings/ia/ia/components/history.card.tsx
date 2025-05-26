import { FormattedDate } from '@/components/compose/forms';
import { IExecutionResult } from '@/types/ia';
import { DateUtils } from '@/utils/utilities/dates';

interface IHistoryCardProps {
  history: IExecutionResult;
}

export const HistoryCard = ({ history }: IHistoryCardProps) => {
  const duration = DateUtils.getTimeDifference(
    history.start_time,
    history.end_time
  );
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
          <FormattedDate date={String(history.start_time)} format='datetime' />
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
        <span>Duration: {duration.miliseconds}ms</span>
        <span className='mx-2'>•</span>
        <span>Processed: {history.item_count}</span>
        <span className='mx-2'>•</span>
        <span>Failed: {history.failed_item_count}</span>
      </div>
    </div>
  );
};
