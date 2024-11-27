import { type FunctionComponent } from 'preact';
import { type ISwitchProps } from './interface';
import { useState } from 'preact/hooks';

export const Switch: FunctionComponent<ISwitchProps> = ({
  id,
  name,
  checked = false,
  label = '',
  onChange,
}: ISwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <div className='flex items-center gap-2'>
      <div className='relative inline-flex items-center cursor-pointer'>
        <input
          type='checkbox'
          id={id}
          name={name}
          checked={isChecked}
          className='sr-only peer'
          onChange={handleChange}
        />
        <div
          onClick={handleChange}
          className="w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
        peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full
        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px]
        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full
        after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"
        />
      </div>
      <label htmlFor={id} className='cursor-pointer' onClick={handleChange}>
        {label}
      </label>
    </div>
  );
};
