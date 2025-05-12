import { type FunctionComponent } from 'preact';
import { type IFloatBadgeProps } from './interface';

export const FloatBadge: FunctionComponent<IFloatBadgeProps> = ({
  label,
  children,
  size = 'h-5 w-5',
  position = '-top-1 -right-1',
  color = 'bg-ternary dark:bg-primary',
}: IFloatBadgeProps) => {
  return (
    <div className='relative'>
      {label && (
        <span
          className={`${size} ${position} ${color} font-bold text-xs absolute rounded-full border border-b-light-dark dark:border-b-dark-light items-center justify-center flex`}
        >
          {label}
        </span>
      )}
      {children}
    </div>
  );
};
