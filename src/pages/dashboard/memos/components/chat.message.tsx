import { Badge } from '@/components/common/badge/badge';
import ShowFiles from '@/components/common/file/show.file';
import { FormattedDate } from '@/components/compose/forms';

interface ChatMessageProps {
  message: string;
  isSender: boolean;
  title?: string;
  resource?: any;
  date?: string | Date;
  priority?: any;
  children?: React.ReactNode;
  id?: number;
  onReply?: (id: number) => void;
  isSelected?: boolean;
  status?: string;
}

export const ChatMessage = ({
  message,
  isSender,
  title,
  resource,
  date,
  priority,
  children,
  id,
  onReply,
  isSelected,
  status,
}: ChatMessageProps) => {
  return (
    <div
      className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4 text-black dark:text-white`}
      onClick={() => id && onReply?.(id)}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg cursor-pointer transition-colors duration-200 relative min-w-[350px]
          ${isSelected ? 'ring-2 ring-primary' : ''}
          ${isSender ? 'bg-primary-opacity dark:bg-gray-600 border-primary' : 'bg-b-light-light dark:bg-b-dark-light border-b-light-dark'}`}
      >
        {(title || status) && (
          <div className='flex items-center gap-2 w-full justify-end'>
            {title && (
              <Badge
                label={title}
                icon='232'
                status='info'
                width='w-auto'
                borderless
              />
            )}
            {children}
          </div>
        )}
        <div className='mb-2'>{message}</div>
        {resource && resource.length > 0 && (
          <div className='mt-2 pt-2'>
            <ShowFiles resources={resource} />
          </div>
        )}
        <div className='flex items-center gap-5 text-xs justify-end mt-2'>
          {priority && (
            <Badge
              label={priority}
              status={
                (priority === 'Alta'
                  ? 'error'
                  : priority === 'Media'
                    ? 'warning'
                    : 'success') as 'info' | 'error' | 'warning' | 'success'
              }
              outline
            />
          )}
          {date && <FormattedDate date={date} format='datetime' />}
          {status && (
            <div
              className={`w-3.5 h-3.5 rounded-full bg-${status === 'OPENED' ? 'primary' : status === 'RESOLVED' ? 'secondary' : 'ternary'}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};
