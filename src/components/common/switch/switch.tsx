import { type FunctionComponent, memo } from 'preact/compat';
import { type ISwitchProps } from './interface';
import { useTranslation } from 'react-i18next';

export const Switch: FunctionComponent<ISwitchProps> = memo(
  ({
    id,
    name,
    label = '',
    onChange,
    value = false,
    backgroundColor,
    identifier,
    disabled = false,
  }: ISwitchProps) => {
    const { t } = useTranslation();
    return (
      <label
        class={`inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <input
          type='checkbox'
          id={id}
          name={name}
          value={identifier}
          checked={value}
          onChange={onChange}
          disabled={disabled}
          class='sr-only peer'
        />
        <div
          class={`
            relative w-8 h-4 rounded-full
            transition-colors duration-200 ease-in-out
            peer-checked:bg-primary
            flex items-center
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
            ${disabled ? 'opacity-50' : ''}
            ${backgroundColor ? backgroundColor : 'bg-gray-200 dark:bg-b-dark-dark'}
          `}
        >
          <div
            class={`
              absolute h-3 w-3 bg-white border border-gray-300
              rounded-full transition-all duration-200 ease-in-out
              ${value ? 'right-[4px]' : 'left-[4px]'}
              peer-checked:border-white
              ${disabled ? 'opacity-50' : ''}
            `}
          />
        </div>
        <span
          class={`ms-3 text-sm font-medium ${disabled ? 'text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-gray-300'}`}
        >
          {t(label)}
        </span>
      </label>
    );
  }
);
