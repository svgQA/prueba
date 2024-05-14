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
}: IButtonProps) => {
  return (
    <button
      id={`${id}-button`}
      name={name}
      type={type}
      onClick={onClick}
      className={`${rounded ? 'rounded-3xl p-1' : 'rounded pl-1 pr-2'} ${full ? 'w-full' : ''} mx-0.5 text-sm items-center justify-center inline-flex font-bold relative text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
    >
      {icon && <span className={`left-0 px-1 vx-icon vx-${icon}`} />}
      {label && !rounded && <p className='capitalize text-center'>{label}</p>}
    </button>
  );
};
