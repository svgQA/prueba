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
      className={`${rounded ? 'rounded-3xl p-1' : 'rounded px-2'} ${full ? 'w-full' : ''} mx-0.5 text-sm items-center py-2 my-0.5 justify-center inline-flex font-bold text-white bg-blue-600`}
    >
      {icon && <span className={`left-0 px-1 vx-icon vx-${icon}`} />}
      {label && !rounded && (
        <p className='w-full capitalize text-center'>{label}</p>
      )}
    </button>
  );
};
