import { useTranslation } from 'react-i18next';
import { ITextAreaProps } from './interface';

export const TextArea = ({
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
  disabled,
  className,
  error,
  warning,
  ...props
}: ITextAreaProps) => {
  const { t } = useTranslation();
  return (
    <div id={id} className='w-full my-1'>
      {label && (
        <label
          for={`${id}-input`}
          className='capitalize block text-sm font-medium text-gray-700 dark:text-gray-200 pb-1'
        >
          {t(label)}
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
          <span
            className={`vox-icon size-sm vx-icon-${icon} px-2 text-gray-500 dark:text-gray-400`}
          />
        )}
        <textarea
          className={`
            w-full px-3 py-2 rounded
            bg-white dark:bg-b-dark-dark
            text-gray-700 dark:text-gray-200
            border-none
            focus:ring-blue-500 dark:focus:ring-blue-400
            ${meta?.touched && meta?.error ? 'border-red-500 focus:ring-red-500' : ''}
            ${thin ? 'py-1' : 'py-2'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className || ''}
          `}
          onChange={onChange}
          name={name}
          onKeyUp={onKeyUp}
          value={value instanceof Date ? value.toISOString() : value}
          id={`${id}-input`}
          placeholder={placeholder ? t(placeholder) : ''}
          required={required}
          tabIndex={tabIndex}
          disabled={disabled}
          {...props}
        />
        {end && icon && (
          <span
            className={`vox-icon vx-icon-${icon} text-gray-500 dark:text-gray-400`}
          />
        )}
      </div>
      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{t(meta.error)}</span>
      )}
      {error && <span className='text-red-500 text-sm'>{t(error)}</span>}
      {warning && <span className='text-yellow-500 text-sm'>{t(warning)}</span>}
    </div>
  );
};
