import { Badge } from '@/components/common/badge/badge';
import { Chip } from '@/components/common/chip/chip';
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
      className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4`}
      onClick={() => id && onReply?.(id)}
    >
      <div
        className={`max-w-[70%] p-3 rounded-lg cursor-pointer transition-colors duration-200
          ${isSelected ? 'ring-2 ring-primary' : ''}
          ${isSender ? 'bg-primary-opacity text-dark border-primary' : 'bg-b-light-light dark:bg-b-dark-light border-b-light-dark'}`}
      >
        {(title || priority || status) && (
          <div className='flex justify-between items-center gap-2 mb-2'>
            <div className='flex items-center gap-2'>
              {title && <Chip label={title} width='lg' icon='123' />}
              {status && (
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-${status === 'OPENED' ? 'primary' : status === 'RESOLVED' ? 'secondary' : 'ternary'} ring-2 ring-white dark:ring-gray-800 shadow-sm`}
                />
              )}
            </div>
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
          </div>
        )}
        <div className='mb-2'>{message}</div>
        {resource && resource.length > 0 && (
          <div className='mt-2 pt-2'>
            <ShowFiles resources={resource} />
          </div>
        )}
        {children}
        {date && (
          <div className='text-xs mt-2 pt-2 flex justify-end'>
            <FormattedDate date={date} format='time' />
          </div>
        )}
      </div>
    </div>
  );
};
