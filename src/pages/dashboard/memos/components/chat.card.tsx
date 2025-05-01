import { Avatar } from '@/components/common/Avatar';
import { FloatBadge } from '@/components/common/badge/float';
import { IUserResponse } from '@/types/auth';

interface ChatCardProps {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  isAI?: boolean;
  onClick: (id: string) => void;
  isSelected?: boolean;
  amount?: number;
  user?: IUserResponse;
}

export const ChatCard = ({
  id,
  name,
  lastMessage,
  time,
  isAI,
  onClick,
  isSelected,
  amount,
  user,
}: ChatCardProps) => (
  <FloatBadge
    label={amount}
    position='-top-1 right-1'
    color={isSelected ? 'bg-white' : 'bg-primary'}
  >
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200 dark:border-b-dark-light border-b-light-dark
        ${isSelected ? 'bg-primary text-white' : 'hover:bg-blue-50 dark:hover:bg-b-dark-light'}
        ${isAI ? 'border-b' : 'border-t'}`}
      onClick={() => onClick(id)}
    >
      <div
        className={`w-10 h-10 rounded-full ${isAI ? 'bg-gradient-to-r from-primary to-blue-500 text-white flex items-center justify-center' : 'bg-gray-300'}`}
      >
        {isAI ? (
          <Avatar icon='202' />
        ) : (
          <Avatar src={user?.image} name={name} square />
        )}
      </div>
      <div className='flex-1 min-w-0 text-white'>
        <h3 className='font-semibold truncate pr-2'>{name}</h3>
        <p className='text-sm truncate'>{lastMessage}</p>
      </div>

      <span className='text-xs'>{time}</span>
    </div>
  </FloatBadge>
);
