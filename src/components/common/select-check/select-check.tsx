import { useTranslation } from 'react-i18next';
import { useField } from 'react-final-form';
import { IOption } from '../smart-selector/smart-select';

export interface IOptionCheck extends IOption {
  icon: string;
  color?: string;
  disabled?: boolean; 
}

interface Props<T = IOptionCheck> {
  name: string;
  // input: SelectCheckInputProps;
  options: T[];
  label?: string;
  onChange?: (value: any) => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SelectCheck<T = IOption>({
  name,
  options,
  label,
  onChange,
  loading = false,
  size = 'sm',
}: Props<T>) {
  const { t } = useTranslation();
  const { input } = useField<IOptionCheck[] | IOptionCheck | string>(name);

  return (
    <>
      {label && (
        <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
          {t(label)}
        </label>
      )}
      <div
        className={`flex gap-2 ${
          size === 'sm'
            ? 'min-h-[35px] text-xs'
            : size === 'md'
              ? 'min-h-[55px] text-base'
              : size === 'lg'
                ? 'min-h-[70px] text-xl'
                : ''
        }`}
      >
        {options.map((option: any) => (
          <label key={option.value} className='relative flex-1 cursor-pointer'>
            <input
              type='radio'
              value={option.value}
              checked={input.value === option.value}
              className='sr-only'
              disabled={loading || option.disabled}
              onChange={(_e) => {
                input.onChange(option.value);
                onChange?.(option);
              }}
            />
            <div
              className={`
                flex items-center justify-center p-1.5 rounded-md border transition-all duration-200
                ${size === 'sm' ? 'min-h-[35px]' : size === 'md' ? 'min-h-[55px]' : size === 'lg' ? 'min-h-[70px]' : ''}
                ${
                  option.disabled
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                    : input.value === option.value
                      ? `border-${option.color || 'primary'} bg-${option.color || 'primary'}/10 shadow-sm scale-[1.02]`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className='flex flex-col items-center gap-0.5'>
                <span
                  className={`vox-icon vx-icon-${option.icon} ${
                    size === 'sm'
                      ? 'text-sm'
                      : size === 'md'
                        ? 'text-lg'
                        : size === 'lg'
                          ? 'text-2xl'
                          : ''
                  } ${
                    option.disabled
                      ? 'text-gray-400'
                      : input.value === option.value
                        ? `text-${option.color || 'primary'}`
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <span
                  className={`${
                    size === 'sm'
                      ? 'text-xs'
                      : size === 'md'
                        ? 'text-base'
                        : size === 'lg'
                          ? 'text-xl'
                          : ''
                  } font-medium leading-tight ${
                    option.disabled
                      ? 'text-gray-400'
                      : input.value === option.value
                        ? `text-${option.color || 'primary'}`
                        : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
}
