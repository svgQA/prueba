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
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors duration-200 border-b dark:border-b-dark-light ${
        isSelected ? 'bg-primary text-white' : 'hover:bg-blue-50'
      }`}
      onClick={() => onClick(id)}
    >
      <div
        className={`w-10 h-10 rounded-full ${isAI ? 'bg-gradient-to-r from-primary to-blue-500 text-white flex items-center justify-center' : 'bg-gray-300'}`}
      >
        {isAI ? (
          <span className='left-0 px-1 vx-icon vx-icon-123' />
        ) : user?.image ? (
          <img
            src={user.image}
            alt={name}
            className='w-full h-full rounded-full object-cover'
          />
        ) : (
          <span className='left-0 px-1 vx-icon vx-icon-007' />
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <h3 className='font-semibold truncate pr-2'>{name}</h3>
        <p
          className={`text-sm truncate ${isSelected ? 'text-white' : 'text-gray-500'}`}
        >
          {lastMessage}
        </p>
      </div>

      <span
        className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}
      >
        {time}
      </span>
    </div>
  </FloatBadge>
);
