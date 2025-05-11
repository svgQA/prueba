import { type FunctionComponent, memo } from 'preact/compat';
import { type ISwitchProps } from './interface';

export const Switch: FunctionComponent<ISwitchProps> = memo(
  ({
    id,
    name,
    label = '',
    onChange,
    value = false,
    backgroundColor,
    identifier,
  }: ISwitchProps) => {
    return (
      <label class='inline-flex items-center cursor-pointer'>
        <input
          type='checkbox'
          id={id}
          name={name}
          value={identifier}
          checked={value}
          onChange={onChange}
          class='sr-only peer'
        />
        <div
          class={`
            relative w-8 h-4 rounded-full
            transition-colors duration-200 ease-in-out
            peer-checked:bg-primary
            flex items-center
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
            ${backgroundColor ? backgroundColor : 'bg-gray-200 dark:bg-b-dark-dark'}
          `}
        >
          <div
            class={`
              absolute h-3 w-3 bg-white border border-gray-300
              rounded-full transition-all duration-200 ease-in-out
              ${value ? 'right-[4px]' : 'left-[4px]'}
              peer-checked:border-white
            `}
          />
        </div>
        <span class='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
          {label}
        </span>
      </label>
    );
  }
);
