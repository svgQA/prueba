import { FunctionComponent } from 'preact';
import { ChevronDown, ChevronUp, Calendar, Shield } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  progress,
}) => (
  <div className='flex items-center w-full'>
    <div className='w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2'>
      <div
        className='bg-blue-600 h-2.5 rounded-full'
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <span className='text-sm font-medium'>{progress}%</span>
  </div>
);

export const InfoIcon: FunctionComponent<{
  onClick: () => void;
  isExpanded: boolean;
}> = ({ onClick, isExpanded }) => (
  <button
    onClick={onClick}
    className='p-1 rounded-full hover:bg-gray-200 transition-colors duration-200'
  >
    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
  </button>
);

export const Modal: FunctionComponent<{
  isOpen: boolean;
  onClose: () => void;
  children: preact.ComponentChildren;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg max-w-lg w-full'>
        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const FormattedDate: FunctionComponent<{ date: string }> = ({
  date,
}) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  const formattedDateStr = `${day}-${month}-${year} ${hours}:${minutes}`;

  return (
    <div className='flex items-center'>
      <Calendar className='mr-2 text-cyan-500' size={16} />
      <span>{formattedDateStr}</span>
    </div>
  );
};

export const PriorityBadge: FunctionComponent<{
  priority: 'Alta' | 'Media' | 'Baja';
}> = ({ priority }) => {
  const bgColor =
    priority === 'Alta'
      ? 'rgb(224,88,88)'
      : priority === 'Media'
        ? 'rgb(255,128,0)'
        : 'rgb(0,189,214)';

  return (
    <div
      className='flex items-center justify-center  py-1 rounded text-white text-sm w-[90px]'
      style={{ backgroundColor: bgColor }}
    >
      <Shield className='mr-2' size={20} />
      <span>{priority}</span>
    </div>
  );
};
