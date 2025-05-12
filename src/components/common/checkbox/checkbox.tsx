import { type FunctionComponent } from 'preact';
import { type ICheckboxProps } from './interface';

export const Checkbox: FunctionComponent<ICheckboxProps> = ({
  onChange,
  id,
  name,
  options = [], // Add default empty array
  label,
  value = {}, // Add default empty object
  required,
  disabled,
  ...props
}: ICheckboxProps) => {
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
      <div className='flex flex-col gap-2'>
        {options.map((option) => (
          <div key={option.value} className='flex items-center'>
            <input
              type='checkbox'
              id={`${id}-${option.value}-ch`}
              name={name}
              value={option.value}
              checked={value[option.value] || false}
              onChange={onChange}
              required={required}
              data-value={option.value}
              className='mr-2'
              disabled={disabled}
              {...props}
            />
            <label for={`${id}-${option.value}-ch`} className='text-sm'>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
