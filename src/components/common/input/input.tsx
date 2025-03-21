import { Button } from '../button/button';
import { type IInputProps } from './interface';

export const Input = ({
  id,
  name,
  min,
  max,
  value,
  step,
  type = 'text',
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
  button,
  onClick,
  normal,
  buttonIcon = '123',
  buttonType = 'button',
  disabled,
  ...props
}: IInputProps) => {
  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === 'Enter' && onClick) {
      onClick?.(value);
      return;
    }
    // onKeyUp?.(e);
  };

  return (
    <div id={id} className='w-full my-1'>
      {label && (
        <label
          for={`${id}-input`}
          className='capitalize block text-sm font-medium'
        >
          {label}
        </label>
      )}
      <div
        className={`${borderless ? '' : 'border-b-light-dark dark:border-b-dark-light border'} rounded flex flex-row items-center w-full`}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <input
          className={`${normal ? '' : 'capitalize'} w-full px-2 flex-1 mr-2 bg-transparent rounded-md ${thin ? '' : 'py-2'} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
          onChange={onChange}
          name={name}
          onKeyUp={handleKeyUp}
          type={type}
          value={value instanceof Date ? value.toISOString() : value}
          step={step}
          min={min}
          max={max}
          id={`${id}-input`}
          placeholder={placeholder}
          pattern={pattern}
          required={required}
          tabIndex={tabIndex}
          disabled={disabled}
          {...props}
        />
        {button && (
          <Button
            onClick={() => onClick?.(value)}
            name='btn-input-action'
            icon={buttonIcon}
            type={buttonType}
            rounded
          />
        )}
        {!button && end && icon && (
          <span className={`vox-icon vx-icon-${icon}`} />
        )}
      </div>
      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{meta.error}</span>
      )}
    </div>
  );
};
