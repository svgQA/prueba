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
  return (
    <div id={id} className='w-full my-1'>
      {label && (
        <label
          for={`${id}-select`}
          className='capitalize block text-sm font-medium text-gray-700 dark:text-gray-200'
        >
          {label}
        </label>
      )}
      <div
        className={`
          ${borderless ? '' : 'border border-gray-200 dark:border-gray-700'}
          rounded flex flex-row items-center
          bg-white dark:bg-b-dark-dark
        `}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <select
          className={`w-full px-3 py-2 rounded
            bg-white dark:bg-b-dark-dark
            text-gray-700 dark:text-gray-200
            border-gray-300 dark:border-gray-700
            focus:ring-blue-500 dark:focus:ring-blue-400
            appearance-none
            ${meta?.touched && meta?.error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          onChange={onChange}
          value={value}
          name={name}
          id={`${id}-select`}
          required={required}
          tabIndex={tabIndex}
          style={{ WebkitAppearance: 'none' }}
          disabled={disabled}
          {...props}
        >
          <option value=''>{placeholder}</option>
          {options?.map((option) => (
            <option key={option[optionValue]} value={option[optionValue]}>
              {option[optionLabel]}
            </option>
          ))}
        </select>
        {end && icon && <span className={`vox-icon vx-icon-${icon}`} />}
      </div>
      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{meta.error}</span>
      )}
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </div>
  );
};
