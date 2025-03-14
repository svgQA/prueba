import { Button } from '@/components/common/button/button';
import { Switch } from '@/components/common/switch/switch';
import { ViewMode } from '@/components/compose/gantt';

export const ViewSwitcher = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
}: any) => {
  return (
    <div className='flex items-center space-x-4 justify-end'>
      <Button
        id='hour-button'
        name='hour-button'
        label='Hour'
        icon='091'
        onClick={() => onViewModeChange(ViewMode.Hour)}
      />
      <Button
        id='quarter-day-button'
        name='quarter-day-button'
        label='Quarter of Day'
        icon='092'
        onClick={() => onViewModeChange(ViewMode.QuarterDay)}
      />
      <Button
        id='half-day-button'
        name='half-day-button'
        label='Half of Day'
        icon='093'
        onClick={() => onViewModeChange(ViewMode.HalfDay)}
      />
      <Button
        id='day-button'
        name='day-button'
        label='Day'
        icon='094'
        onClick={() => onViewModeChange(ViewMode.Day)}
      />
      <Button
        id='week-button'
        name='week-button'
        label='Week'
        icon='095'
        onClick={() => onViewModeChange(ViewMode.Week)}
      />
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
