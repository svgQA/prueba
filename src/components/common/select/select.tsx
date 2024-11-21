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
}: ISelectProps) => {
  return (
    <div id={id} name={name} className='my-1 w-full'>
      {label && (
        <label
          for={`${id}-select`}
          className='capitalize block text-sm font-medium'
        >
          {label}
        </label>
      )}
      <div className='rounded flex flex-row items-center border-b-light-dark dark:border-b-dark-light border-2 py-1 px-2'>
        {!end && icon && (
          <span className={`vox-icon size-sm vx-icon-${icon}`} />
        )}
        <select
          className='capitalize px-2 py-1 w-full'
          onChange={onChange}
          value={value}
          id={`${id}-select`}
          placeholder={placeholder}
          required={required}
        >
          <option value=''>{placeholder}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.key}
            </option>
          ))}
        </select>
        {end && icon && <span className={`vox-icon vx-icon-${icon}`} />}
      </div>
      {meta && meta.touched && meta.error && <span>{meta?.error}</span>}
    </div>
  );
};
