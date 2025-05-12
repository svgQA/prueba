import { useState } from 'preact/hooks';
import { Button } from '@/components/common/button/button';
import { Switch } from '@/components/common/switch/switch';
import { ViewMode } from '../../types/public-types';
import { Chip } from '@/components/common/chip/chip';

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
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className='flex items-center gap-2'>
        <Chip label={status}></Chip>
        <button
          type='button'
          className='inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-white rounded-md hover:bg-gray-50 dark:text-white dark:hover:bg-b-dark-light dark:bg-b-dark-light'
        >
          <span className='vox-icon vx-icon-120 text-gray-500' />
          <span className='vox-icon vx-icon-001 text-gray-500' />
        </button>
      </div>

      {isOpen && (
        <div className='absolute right-0 w-48 py-3 z-50'>
          <div className='bg-white dark:bg-b-dark-light py-2 rounded-lg border-2 border-gray-100 flex flex-col items-center space-y-2 justify-end px-1 pb-4'>
            <Button
              id='hour-button'
              name='hour-button'
              label='2 Dias'
              full
              selected={status === ViewMode.Hour}
              onClick={() => onViewModeChange(ViewMode.Hour)}
            />
            <Button
              id='quarter-day-button'
              name='quarter-day-button'
              label='Semana'
              full
              selected={status === ViewMode.QuarterDay}
              onClick={() => onViewModeChange(ViewMode.QuarterDay)}
            />
            <Button
              id='month-button'
              name='month-button'
              label='Mes'
              full
              selected={status === ViewMode.HalfDay}
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
