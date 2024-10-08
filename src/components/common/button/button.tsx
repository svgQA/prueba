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
}: IButtonProps) => {
  return (
    <button
      id={`${id}-button`}
      name={name}
      type={type}
      onClick={onClick}
      className={`${rounded ? 'rounded-3xl p-1' : 'rounded px-2'} ${full ? 'w-full' : ''} mx-1 text-sm items-center py-2 my-0.5 justify-center inline-flex font-bold ${className}`}
    >
      {icon && <span className={`left-0 px-1 vx-icon vx-${icon}`} />}
      {label && !rounded && (
        <p className='w-full capitalize text-center'>{label}</p>
      )}
    </button>
  );
};
