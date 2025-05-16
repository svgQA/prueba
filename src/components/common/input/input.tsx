import { Button } from '../button/button';
import { type IInputProps } from './interface';

export const Input = <T = string,>({
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
  readOnly, // ✅ agregado
  ref,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  error,
  warning,
  ...props
}: IInputProps<T>) => {
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
    <div id={id} className='w-full mt-1'>
      {label && (
        <label
          htmlFor={`${id}-input`}
          className='capitalize block text-sm font-medium'
        >
          {label}
        </label>
      )}
      <div
        className={`
          ${borderless ? '' : 'border border-gray-200 dark:border-gray-700'}
          rounded flex flex-row items-center w-full
          bg-white dark:bg-b-dark-dark
        `}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <div className='relative flex-1 py-0.5'>
          <input
            ref={ref}
            className={`w-full px-3 py-2 rounded
              bg-white dark:bg-b-dark-dark
              text-gray-700 dark:text-gray-200
              border-gray-300 dark:border-gray-700
              focus:ring-blue-500 dark:focus:ring-blue-400
              ${meta?.touched && meta?.error ? 'border-red-500 focus:ring-red-500' : ''}
              ${
                type === 'number'
                  ? `
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:bg-gray-100
                [&::-webkit-inner-spin-button]:dark:bg-b-dark-dark
                [&::-webkit-inner-spin-button]:hover:bg-gray-200
                [&::-webkit-inner-spin-button]:dark:hover:bg-gray-700
                [&::-webkit-inner-spin-button]:transition-colors
                [&::-webkit-inner-spin-button]:duration-200
                [&::-webkit-inner-spin-button]:opacity-100
                [&::-webkit-inner-spin-button]:dark:opacity-100
                [&::-webkit-inner-spin-button]:text-gray-900
                [&::-webkit-inner-spin-button]:dark:text-gray-200
              `
                  : ''
              }
            `}
            onChange={onChange}
            name={name}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp ? handleKeyUp : undefined}
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
            readOnly={readOnly} // ✅ agregado
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
            borderless
          />
        )}
        {!button && end && icon && (
          <span className={`vox-icon vx-icon-${icon}`} />
        )}
      </div>
      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{meta.error}</span>
      )}
      {error && <span className='text-red-500 text-sm'>{error}</span>}
      {warning && <span className='text-yellow-500 text-sm'>{warning}</span>}
    </div>
  );
};
