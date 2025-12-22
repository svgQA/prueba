import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { useTranslation } from 'react-i18next';

interface HelpTooltipProps {
  title?: string;
  content: string;
  icon?: string;
  className?: string;
}

export const HelpTooltip: FunctionComponent<HelpTooltipProps> = ({
  title = 'Ayuda',
  content,
  icon = '323',
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleTooltip = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block align-middle ${className}`}>
      <Button
        name='help-tooltip'
        type='button'
        icon={icon}
        onClick={toggleTooltip}
        transparent
        borderless
        className='p-1 text-blue-500 hover:text-blue-700 transition-colors align-middle'
      />
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className='fixed inset-0 z-40' onClick={toggleTooltip} />
          {/* Tooltip */}
          <div className='absolute z-50 left-1/2 top-full mt-1 -translate-x-1/2 min-w-[220px] max-w-xs'>
            <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 pr-0 relative'>
              {/* Arrow */}
              <div className='absolute w-2.5 h-2.5 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45 -top-1 left-1/2 -translate-x-1/2 z-10' />
              {/* Header */}
              <div className='flex items-center justify-between mb-1 pb-1 border-b border-gray-100 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-1'>
                  {t(title)}
                </h3>
                {/*
                <Button
                  name='close-tooltip'
                  type='button'
                  onClick={toggleTooltip}
                  className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-base font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                  icon='008'
                  transparent
                  borderless
                />
                */}
              </div>
              {/* Content */}
              <div className='text-gray-700 dark:text-gray-300 text-xs leading-normal pt-1'>
                {t(content)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
