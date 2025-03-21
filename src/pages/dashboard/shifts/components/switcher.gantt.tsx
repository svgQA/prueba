import { Button } from '@/components/common/button/button';
import { Switch } from '@/components/common/switch/switch';
import { ViewMode } from '@/components/compose/gantt';

interface IViewSwitcherProps {
  onViewModeChange: (mode: ViewMode) => void;
  onViewListChange: (show: boolean) => void;
  isChecked: boolean;
  status: ViewMode;
}

export const ViewSwitcher = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
  status,
}: IViewSwitcherProps) => {
  return (
    <div className='flex items-center space-x-4 justify-end py-3 pr-4'>
      <Button
        id='hour-button'
        name='hour-button'
        label='Hour'
        big
        className={status === ViewMode.Hour ? 'bg-primary-opacity-2' : ''}
        // icon='091'
        onClick={() => onViewModeChange(ViewMode.Hour)}
      />
      <Button
        id='quarter-day-button'
        name='quarter-day-button'
        label='Week'
        big
        className={status === ViewMode.QuarterDay ? 'bg-primary-opacity-2' : ''}
        // icon='092'
        onClick={() => onViewModeChange(ViewMode.QuarterDay)}
      />
      {/*
      <Button
        id='half-day-button'
        name='half-day-button'
        label='Half of Day'
        big
        className={status === ViewMode.HalfDay ? 'bg-primary-opacity-2' : ''}
        // icon='093'
        onClick={() => onViewModeChange(ViewMode.HalfDay)}
      />
      <Button
        id='day-button'
        name='day-button'
        label='Day'
        big
        className={status === ViewMode.Day ? 'bg-primary-opacity-2' : ''}
        // icon='094'
        onClick={() => onViewModeChange(ViewMode.Day)}
      />
      */}
      {/*
      <Button
        id='week-button'
        name='week-button'
        label='Week'
        big
        className={status === ViewMode.Week ? 'bg-primary-opacity-2' : ''}
        // icon='095'
        onClick={() => onViewModeChange(ViewMode.Week)}
      />
      */}
      <Switch
        id={`cb-shift-gantt-vals`}
        name='shift-gantt-vals'
        label='Show Task List'
        onChange={() => onViewListChange(!isChecked)}
        value={isChecked}
      />
    </div>
  );
};
