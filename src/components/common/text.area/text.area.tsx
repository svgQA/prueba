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
  ...props
}: ITextAreaProps) => {
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
        <textarea
          className={`capitalize px-2 w-full mr-2 bg-transparent rounded-md ${thin ? '' : 'py-2'}`}
          onChange={onChange}
          name={name}
          onKeyUp={onKeyUp}
          value={value}
          id={`${id}-input`}
          placeholder={placeholder}
          required={required}
          tabIndex={tabIndex}
          disabled={disabled}
          {...props}
        />
        {end && icon && <span className={`vox-icon vx-icon-${icon}`} />}
      </div>
      {meta && meta.touched && meta.error && (
        <span className='text-red-500 text-sm'>{meta.error}</span>
      )}
    </div>
  );
};
