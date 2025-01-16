import { type FunctionComponent } from 'preact';
import { type IFloatBadgeProps } from './interface';

export const FloatBadge: FunctionComponent<IFloatBadgeProps> = ({
  label,
  children,
  size = 'h-4 w-4',
  position = '-top-1 -right-1',
  color = 'bg-secondary',
}: IFloatBadgeProps) => {
  return (
    <div className='relative'>
      {label && (
        <span
          className={`${size} ${position} ${color} text-center font-bold text-xs absolute rounded-full border border-b-light-dark dark:border-b-dark-light`}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
};
