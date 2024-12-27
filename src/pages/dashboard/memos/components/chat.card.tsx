interface ChatCardProps {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  isAI?: boolean;
  onClick: (id: number) => void;
  isSelected?: boolean;
}

export const ChatCard = ({
  id,
  name,
  lastMessage,
  time,
  isAI,
  onClick,
  isSelected,
}: ChatCardProps) => (
  <div
    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors duration-200 border-b dark:border-b-dark-light ${
      isSelected ? 'bg-primary text-white' : 'hover:bg-blue-50'
    }`}
    onClick={() => onClick(id)}
  >
    <div
      className={`w-10 h-10 rounded-full ${isAI ? 'bg-gradient-to-r from-primary to-blue-500 text-white flex items-center justify-center' : 'bg-gray-300'}`}
    >
      {isAI && <span className='left-0 px-1 vx-icon vx-icon-123' />}
    </div>
    <div className='flex-1'>
      <h3 className='font-semibold'>{name}</h3>
      <p className={`text-sm ${isSelected ? 'text-white' : 'text-gray-500'}`}>
        {lastMessage}
      </p>
    </div>
    <span className={`text-xs ${isSelected ? 'text-white' : 'text-gray-500'}`}>
      {time}
    </span>
  </div>
);
