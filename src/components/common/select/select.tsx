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
  ...props
}: ISelectProps) => {
  return (
    <div id={id} name={name} className='w-full'>
      {label && (
        <label
          for={`${id}-select`}
          className='capitalize block text-sm font-medium'
        >
          {label}
        </label>
      )}
      <div
        className={`${borderless ? '' : 'border-b-light-dark dark:border-b-dark-light border-2'} rounded flex flex-row items-center`}
      >
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon} px-2`} />
        )}
        <select
          className={`capitalize px-2 w-full mr-2 bg-transparent rounded-md appearance-none ${thin ? '' : 'py-2'}`}
          onChange={onChange}
          value={value}
          name={name}
          id={`${id}-select`}
          placeholder={placeholder}
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
    </div>
  );
};
