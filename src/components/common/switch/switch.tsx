import { type FunctionComponent } from 'preact';
import { type ISwitchProps } from './interface';

export const Switch: FunctionComponent<ISwitchProps> = ({
  id,
  name,
  label = '',
  onChange,
  value = false,
}: ISwitchProps) => {
  return (
    <label class='inline-flex items-center cursor-pointer'>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={value}
        onChange={onChange}
        className='sr-only peer'
      />
      <div class="relative w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
      <span class='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
        {label}
      </span>
    </label>
  );
};
