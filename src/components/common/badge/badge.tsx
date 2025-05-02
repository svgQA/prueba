import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  size = 'xs',
  status = 'error',
}: IBadgeProps) => {
  return (
    <span
      className={`
        text-${size} items-center capitalize pl-1 px-2 flex justify-between py-0.5 bg-white dark:bg-b-dark-light rounded-full w-fit border border-gray-100 dark:border-gray-700
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
