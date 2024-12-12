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
    <div className='flex items-center gap-2'>
      <div className='relative inline-flex items-center cursor-pointer'>
        <input
          type='checkbox'
          id={id}
          name={name}
          checked={value}
          onChange={onChange}
          className='sr-only peer'
        />
        <div
          onClick={() => {
            const event = {
              target: { type: 'checkbox', checked: !value, name: name },
            };
            onChange?.(event as any);
          }}
          className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2
        peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
        after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full
        after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"
        />
      </div>
      <label htmlFor={id} className='cursor-pointer capitalize'>
        {label}
      </label>
    </div>
  );
};
