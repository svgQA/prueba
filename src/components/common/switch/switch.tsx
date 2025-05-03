import { type FunctionComponent, memo } from 'preact/compat';
import { type ISwitchProps } from './interface';

export const Switch: FunctionComponent<ISwitchProps> = memo(
  ({ id, name, label = '', onChange, value = false }: ISwitchProps) => {
    return (
      <label class='inline-flex items-center cursor-pointer select-none'>
        <input
          type='checkbox'
          id={id}
          name={name}
          checked={value}
          onChange={onChange}
          class='sr-only peer'
        />
        <div
          class='
            relative w-8 h-4 bg-gray-200 dark:bg-gray-800 rounded-full
            transition-colors
            peer-checked:bg-primary
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
          '
        >
          <div
            class='
              absolute top-[2px] left-[4px] h-3 w-3 bg-white border border-gray-300
              rounded-full transition-transform
              peer-checked:translate-x-4 peer-checked:border-white
            '
          />
        </div>
        <span class='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
          {label}
        </span>
      </label>
    );
  }
);
