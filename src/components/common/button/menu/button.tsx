import { type FunctionComponent } from 'preact';
import { type IButtonMenuProps } from './interface';

export const ButtonMenu: FunctionComponent<IButtonMenuProps> = ({
  label,
  icon,
  name,
  small,
}: IButtonMenuProps) => {
  return (
    <div
      className={`${small ? 'h-10' : 'h-12'} my-1 text-center overflow-hidden relative cursor-pointer content-end px-1`}
    >
      <span
        name={name}
        className={'absolute w-full left-0 top-0 vx-icon vx-' + icon}
      ></span>
      <h6 className={`${small ? 'text-3xs' : 'text-xs'} capitalize`}>
        {label}
      </h6>
    </div>
  );
};
