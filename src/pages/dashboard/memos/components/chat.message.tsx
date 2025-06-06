import { Badge } from '@/components/common/badge/badge';
import { Chip } from '@/components/common/chip/chip';
import { showFiles } from "@/components/common/file/show.file";
import { FormattedDate } from "@/components/compose/forms";

interface ChatMessageProps {
  message: string;
  isSender: boolean;
  title?: string;
  resource?: any;
  date?: string | Date;
  priority?: any;
  children?: React.ReactNode;
}

export const ChatMessage = ({ message, isSender, title, resource, date, priority, children }: ChatMessageProps) => (
  <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'} mb-4`}>
    <div
      className={`max-w-[70%] p-3 rounded-lg ${isSender ? 'bg-primary-opacity text-dark border-primary' : 'bg-b-light-light dark:bg-b-dark-light border-b-light-dark'}`}
    >
      {(title || priority) && (
        <div className='flex justify-between items-center gap-2 mb-2'>
          {title && (
            <Chip
              label={title}
              width='lg'
              icon='123'
            />
          )}
          {priority && (
            <Badge
              label={priority}
              status={(priority === 'Alta' ? 'error' : priority === 'Media' ? 'warning' : 'success') as 'info' | 'error' | 'warning' | 'success'}
              outline
            />
          )}
        </div>
      )}
      <div className='mb-2'>{message}</div>
      {resource && resource.length > 0 && (
        <div className='mt-2 pt-2'>
          {showFiles(resource)}
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
