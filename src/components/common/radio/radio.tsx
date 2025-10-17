import { type FunctionComponent } from 'preact';
import { type IRadioProps } from './interface';
import { useTranslation } from 'react-i18next';

export const Radio: FunctionComponent<IRadioProps> = ({
  onChange,
  id,
  name,
  options,
  label,
  value,
  required,
  disabled,
  ...props
}: IRadioProps) => {
  const { t } = useTranslation();
  return (
    <div id={id} className='w-full my-1'>
      {label && (
        <label
          for={`${id}-input`}
          className='capitalize block text-sm font-medium'
        >
          {t(label)}
        </label>
      )}
      <div className='flex flex-col gap-2'>
        {options?.map((option) => (
          <div key={option.value} className='flex items-center'>
            <input
              type='radio'
              id={`${id}-${option.value}-ra`}
              name={name}
              value={option.value}
              checked={String(value) === String(option.value)}
              onChange={onChange}
              required={required}
              className='mr-2'
              disabled={disabled}
              {...props}
            />
            <label for={`${id}-${option.value}-ra`} className='text-sm'>
              {t(option.label)}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
