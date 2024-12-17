import { type FunctionComponent } from 'preact';
import { type IButtonProps } from './interface';

export const Button: FunctionComponent<IButtonProps> = ({
  label,
  id,
  name,
  type,
  icon,
  onClick,
  rounded,
  full,
  className,
  loading,
  disabled,
  end,
}: IButtonProps) => {
  return (
    <button
      id={`${id}-button`}
      name={name}
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${rounded ? 'rounded-full px-1' : 'rounded px-2'} ${full ? 'w-full' : ''} h-fit mx-1 text-sm items-center py-2 my-0.5 justify-center inline-flex font-bold ${className} border border-b-light-dark dark:border-b-dark-light`}
    >
      {icon && !end && (
        <span className={`left-0 px-1 size vox-icon vx-icon-${icon}`} />
      )}
      {label && !rounded && (
        <div className='flex flex-row justify-between items-center'>
          <p className='w-full capitalize text-center'>{label}</p>
          <span
            className={`left-0 px-1 vx-icon vx-logo ${loading ? 'visible' : 'invisible'}`}
          />
        </div>
      )}
      {icon && end && (
        <span className={`left-0 px-1 size vox-icon vx-icon-${icon}`} />
      )}
    </button>
  );
};
