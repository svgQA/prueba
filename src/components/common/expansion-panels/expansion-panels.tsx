import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { IExpansionPanelProps } from './interface';

export const ExpansionPanel: FunctionComponent<IExpansionPanelProps> = ({
  id,
  // name,
  title,
  subtitle,
  disabled = false,
  className = '',
  children,
  onAdd,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleToggle = (): void => {
    if (!disabled) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleAdd = (e: MouseEvent): void => {
    e.stopPropagation();
    if (onAdd && !disabled) {
      onAdd();
    }
  };

  return (
    <div
      id={id}
      // name={name}
      className={`border rounded-md overflow-hidden ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <div
        className={`flex items-center justify-between p-4 bg-gray-50 ${
          !disabled ? 'cursor-pointer hover:bg-gray-100' : ''
        }`}
        onClick={handleToggle}
      >
        <div className='flex flex-col'>
          <span className='font-medium'>{title}</span>
          {subtitle && (
            <span className='text-sm text-gray-500'>{subtitle}</span>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {onAdd && (
            <button
              onClick={handleAdd}
              type='button'
              className='p-1 hover:bg-gray-200 rounded-full'
              disabled={disabled}
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4v16m8-8H4'
                />
              </svg>
            </button>
          )}
          <svg
            className={`w-5 h-5 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>
      {isExpanded && <div className='p-4 border-t'>{children}</div>}
    </div>
  );
};
