import { useState } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { Switch } from '@/components/common/switch/switch';
import { ViewMode } from '../../types/public-types';

interface IGroupProps {
  className?: string;
  onViewModeChange: (mode: ViewMode) => void;
  onViewListChange: (show: boolean) => void;
  isChecked: boolean;
  status: ViewMode;
}

export const Group = ({
  className = '',
  onViewModeChange,
  onViewListChange,
  isChecked,
  status,
}: IGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        className='inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50'
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className='vox-icon vx-icon-120 text-gray-500' />
        {/* {displayText && <span>{displayText}</span>} */}
        <span className='vox-icon vx-icon-001 text-gray-500' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border-2 border-gray-100 py-1 z-50'>
          <div className='flex flex-col items-center space-y-4 justify-end px-1'>
            <Button
              id='hour-button'
              name='hour-button'
              label='2 Dias'
              big
              className={`${status === ViewMode.Hour ? 'bg-primary-opacity-2' : ''} w-full`}
              onClick={() => onViewModeChange(ViewMode.Hour)}
            />
            <Button
              id='quarter-day-button'
              name='quarter-day-button'
              label='Semana'
              big
              className={`${status === ViewMode.QuarterDay ? 'bg-primary-opacity-2' : ''} w-full`}
              onClick={() => onViewModeChange(ViewMode.QuarterDay)}
            />
            <Button
              id='month-button'
              name='month-button'
              label='Mes'
              big
              className={`${status === ViewMode.HalfDay ? 'bg-primary-opacity-2' : ''} w-full`}
              onClick={() => onViewModeChange(ViewMode.HalfDay)}
            />
            <Switch
              id={`cb-shift-gantt-vals`}
              name='shift-gantt-vals'
              label='Show Task List'
              onChange={() => onViewListChange(!isChecked)}
              value={isChecked}
            />
          </div>
        </div>
      )}
    </div>
  );
};
