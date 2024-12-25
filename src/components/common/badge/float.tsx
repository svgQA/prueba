import { type FunctionComponent } from 'preact';
import { type IFloatBadgeProps } from './interface';

export const FloatBadge: FunctionComponent<IFloatBadgeProps> = ({
  label,
  children,
}: IFloatBadgeProps) => {
  return (
    <div className='relative flex justify-center'>
      {label && (
        <span className='text-center font-bold text-xs absolute w-4 h-4 bg-primary -top-1 -right-1 rounded-full border border-b-light-dark dark:border-b-dark-light'>
          {label}
        </span>
      )}
      {children}
    </div>
  );
};
