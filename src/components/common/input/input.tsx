import { type IInputProps } from './interface';
import { type FunctionComponent } from 'preact';

export const Input: FunctionComponent<IInputProps> = ({
  id,
  name,
  min,
  max,
  value,
  step,
  type,
  label,
  icon,
  required,
  pattern,
  onChange,
  onKeyUp,
  placeholder,
}: IInputProps) => {
  return (
    <div id={id} name={name} className='w-full'>
      <label
        for={`${id}-input`}
        className='capitalize block text-sm font-medium text-gray-900 dark:text-white'
      >
        {label}
      </label>
      <div className='relative bg-red-400 border-gray-300 rounded flex items-center focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
        <input
          className='w-full p-2.5 rounded pl-10 bg-transparent capitalize'
          onChange={onChange}
          onKeyUp={onKeyUp}
          type={type}
          value={value}
          step={step}
          min={min}
          max={max}
          id={`${id}-input`}
          placeholder={placeholder}
          pattern={pattern}
          required={required}
        />
        {icon && <span className={`absolute left-0 px-2 vx-icon vx-${icon}`} />}
      </div>
    </div>
  );
};
