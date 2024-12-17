import { type FunctionComponent } from 'preact';
import { type ICheckboxProps } from './interface';

export const Checkbox: FunctionComponent<ICheckboxProps> = ({
  onChange,
  id,
  name,
  options,
  label,
  value,
  required,
  ...props
}: ICheckboxProps) => {
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
      <div className='flex flex-col gap-2'>
        {options?.map((option) => (
          <div key={option.value} className='flex items-center'>
            <input
              type='checkbox'
              id={`${id}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              className='mr-2'
              {...props}
            />
            <label htmlFor={`${id}-${option.value}`} className='text-sm'>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
