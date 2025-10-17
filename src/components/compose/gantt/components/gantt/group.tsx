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
        <Button
          id='show-task-list'
          name='show-task-list'
          onClick={() => onViewListChange(!isChecked)}
          selected={isOpen}
          icon='120'
          borderless
        />
      </div>

      {isOpen && (
        <div className='absolute right-0 w-48 py-3 z-50'>
          <div className='bg-white dark:bg-b-dark-dark py-2 rounded-lg border-2 border-gray-100 flex flex-col items-center space-y-2 justify-end px-1 pb-4'>
            <Button
              id='hour-button'
              name='hour-button'
              label='2 Dias'
              borderless
              full
              selected={status === ViewMode.Hour}
              onClick={() => onViewModeChange(ViewMode.Hour)}
            />
            <Button
              id='quarter-day-button'
              name='quarter-day-button'
              label='Semana'
              borderless
              full
              selected={status === ViewMode.QuarterDay}
              onClick={() => onViewModeChange(ViewMode.QuarterDay)}
            />
            <Button
              id='month-button'
              name='month-button'
              label='Mes'
              borderless
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
