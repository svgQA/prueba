import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  size = 'xs',
  status = 'error',
  full = false,
  borderless = false,
}: IBadgeProps) => {
  return (
    <span
      className={`
        text-${size} items-center capitalize px-3 py-0.5 flex justify-between rounded-full border-gray-100 dark:border-gray-700 font-bold text-base
        ${full ? 'w-full' : 'w-fit'}
        ${borderless ? 'border-none' : 'border'}
        ${!icon ? (status === 'error' ? 'bg-error' : status === 'success' ? 'bg-secondary' : status === 'warning' ? 'bg-amber-400' : status === 'info' ? 'bg-primary' : 'bg-white dark:bg-b-dark-light') : 'bg-white dark:bg-b-dark-light'}
      `}
    >
      {icon && (
        <span
          className={`vx-icon vx-icon-${icon} size-${size} mx-1 ${status === 'error' ? 'text-error' : status === 'success' ? 'text-secondary' : status === 'warning' ? 'text-amber-400' : status === 'info' ? 'text-gray-400' : ''}`}
        ></span>
      )}
      {label}
    </span>
  );
};
