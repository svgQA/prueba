import { useState, useRef, useEffect } from 'preact/hooks';

interface SwitcherOption {
  id: string;
  label: string;
  icon?: string;
}

interface CustomSwitcherProps {
  options: SwitcherOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  borderless?: boolean;
}

export const CustomSwitcher = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  icon = '🌐',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  optionClassName = '',
  borderless = false,
}: CustomSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current selected option
  const currentOption = options.find((option) => option.id === value) || {
    label: placeholder,
  };

  // Handle option change
  const handleOptionChange = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 min-w-40 justify-between ${buttonClassName} ${
          borderless ? 'border-none' : ''
        }`}
      >
        <span className='text-lg'>{icon}</span>
        <span>{currentOption.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
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
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 ${dropdownClassName}`}
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionChange(option.id)}
              className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors duration-200 border-none ${
                option.id === value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${optionClassName}`}
            >
              {option.icon && <span className='mr-2'>{option.icon}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
