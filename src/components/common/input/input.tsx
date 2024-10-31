import { type IInputProps } from './interface';

export const Input = ({
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
    <div id={id} name={name} className='w-full border-2 my-1'>
      <label
        for={`${id}-input`}
        className='capitalize block text-sm font-medium text-gray-900 dark:text-white'
      >
        {label}
      </label>
      <div className='relative border-gray-300 rounded flex items-center'>
        <input
          className='w-full p-2.5 rounded pl-10 bg-transparent border border-gray-300 capitalize'
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
