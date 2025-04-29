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
  ref,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  ...props
}: IInputProps) => {
  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === 'Enter' && onClick) {
      onClick?.(value);
      return;
    }
  };

  const isDateTimeInput =
    type === 'date' || type === 'time' || type === 'datetime-local';

  const handleInputClick = (e: MouseEvent) => {
    if (isDateTimeInput && !disabled) {
      const input = e.currentTarget as HTMLInputElement;
      input.showPicker();
    }
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
        className={`${borderless ? '' : 'border-b-light-dark dark:border-b-dark-light border'} rounded flex flex-row items-center w-full ${
          isDateTimeInput ? 'cursor-pointer' : ''
        }`}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <div className='relative flex-1'>
          <input
            ref={ref}
            className={`w-full px-3 py-2 rounded ${
              meta?.touched && meta?.error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            } appearance-none`}
            onChange={onChange}
            name={name}
            onKeyUp={handleKeyUp}
            onClick={handleInputClick}
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
          {isDateTimeInput && (
            <div className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none'>
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
            </div>
          )}
        </div>
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
