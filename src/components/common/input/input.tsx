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
  meta,
  end,
  tabIndex,
  borderless,
  thin,
  ...props
}: IInputProps) => {
  return (
    <div id={id} name={name} className='w-full my-1'>
      {label && (
        <label
          for={`${id}-input`}
          className='capitalize block text-sm font-medium'
        >
          {label}
        </label>
      )}
      <div
        className={`${borderless ? '' : 'border-b-light-dark dark:border-b-dark-light border'} rounded flex flex-row items-center`}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <input
          className={`capitalize px-2 w-full mr-2 bg-transparent rounded-md ${thin ? '' : 'py-2'} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          onChange={onChange}
          name={name}
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
          tabIndex={tabIndex}
          {...props}
        />
        {end && icon && <span className={`vox-icon vx-icon-${icon}`} />}
      </div>
      {meta && meta.touched && meta.error && <span>{meta?.error}</span>}
    </div>
  );
};
