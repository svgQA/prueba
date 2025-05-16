import { FunctionComponent } from 'preact';
import { FieldRenderProps } from 'react-final-form';

export interface IScheduleOption {
  id: number;
  name: string;
  daysAllowed: string;
}

interface IScheduleSelectorProps {
  input: FieldRenderProps<any>['input'];
  meta?: FieldRenderProps<any>['meta'];
  options: IScheduleOption[];
  searchValue?: string;
}

export const ScheduleSelector: FunctionComponent<IScheduleSelectorProps> = ({
  input,
  options,
  searchValue = '',
}) => {
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedValues: number[] = Array.isArray(input.value)
    ? input.value
    : [];

  return (
    <div className='w-full'>
      <div className='max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-b-dark-dark p-4 vox-scroll-design'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
          {filteredOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors duration-200
                ${
                  selectedValues.includes(option.id)
                    ? 'bg-primary/10 dark:bg-primary/20 border-primary dark:border-primary'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border-transparent'
                }
                border-2 h-full`}
            >
              <input
                type='checkbox'
                className='w-4 h-4 mt-1 rounded border-gray-300 dark:border-gray-600
                  text-primary focus:ring-primary
                  dark:bg-gray-700 dark:checked:bg-primary'
                checked={selectedValues.includes(option.id)}
                onChange={(e) => {
                  const newValue = e.currentTarget.checked
                    ? [...selectedValues, option.id]
                    : selectedValues.filter((id: number) => id !== option.id);
                  input.onChange(newValue);
                }}
              />
              <div className='ml-3 flex-1 min-w-0'>
                <div className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
                  {option.name}
                </div>
                <div className='text-xs text-gray-500 dark:text-gray-400 mt-0.5'>
                  {option.daysAllowed}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
