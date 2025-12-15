import { useTranslation } from 'react-i18next';
import { type ISelectProps } from './interface';

export const Select = ({
  id,
  name,
  value,
  label,
  icon,
  required,
  onChange,
  placeholder,
  meta,
  end,
  options,
  borderless,
  thin,
  tabIndex,
  disabled,
  optionValue = 'value',
  optionLabel = 'label',
  error,
  ...props
}: ISelectProps) => {
  const { t } = useTranslation();

  return (
    <div id={id} className='w-full my-1'>
      {label && (
        <label
          htmlFor={`${id}-select`}
          className='capitalize block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          {t(label)}
        </label>
      )}

      <div
        className={`
          ${borderless ? '' : 'border border-gray-200 dark:border-gray-700'}
          rounded-md flex flex-row items-center
          bg-white dark:bg-b-dark-dark
          ${thin ? 'h-9' : 'h-10'}
        `}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}

        <select
          className={`
            w-full px-3 py-2 pr-8 rounded-md
            bg-transparent
            text-gray-700 dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            appearance-none
            border-0
            focus:outline-none focus:ring-0
            disabled:opacity-60 disabled:cursor-not-allowed
            ${meta?.touched && meta?.error ? 'ring-1 ring-red-500' : ''}
          `}
          onChange={onChange}
          value={value}
          name={name}
          id={`${id}-select`}
          required={required}
          tabIndex={tabIndex}
          disabled={disabled}
          {...props}
        >
          <option value=''>{t(placeholder || '')}</option>
          {options?.map((option) => (
            <option key={option[optionValue]} value={option[optionValue]}>
              {t(option[optionLabel])}
            </option>
          ))}
        </select>

        {end && icon && <span className={`vox-icon vx-icon-${icon} px-2`} />}
      </div>

      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{meta.error}</span>
      )}
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  );
};
