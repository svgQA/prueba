import { Switch } from '@/components/common/switch/switch';
import { ViewMode } from '@/components/compose/gantt';

export const ViewSwitcher = ({
  onViewModeChange,
  onViewListChange,
  isChecked,
}: any) => {
  return (
    <div className='flex items-center space-x-4 justify-end'>
      {/*
      <button
        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        onClick={() => onViewModeChange(ViewMode.QuarterDay)}
      >
        Quarter of Day
      </button>
      <button
        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        onClick={() => onViewModeChange(ViewMode.HalfDay)}
      >
        Half of Day
      </button>
      */}
      <button
        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        onClick={() => onViewModeChange(ViewMode.Day)}
      >
        Day
      </button>
      <button
        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        onClick={() => onViewModeChange(ViewMode.Week)}
      >
        Week
      </button>
      <button
        className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        onClick={() => onViewModeChange(ViewMode.Month)}
      >
        Month
      </button>

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
