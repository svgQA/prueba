import { type FunctionComponent } from 'preact';
import { type IButtonMenuProps } from './interface';

export const ButtonMenu: FunctionComponent<IButtonMenuProps> = ({
  label,
  icon,
  small,
}: IButtonMenuProps) => {
  return (
    <div
      className={`
        ${small ? 'h-10' : 'h-12'}
        my-1 text-center overflow-hidden relative cursor-pointer content-end px-1 hover:text-primary
        w-14
      `}
    >
      <span
        className={`absolute w-full left-0 h-14 -top-1 vx-icon vx-icon-${icon}`}
      ></span>
      <h6
        className={`
          ${small ? 'text-2xs' : 'text-xs'}
          capitalize
          truncate
          overflow-hidden
          whitespace-nowrap
        `}
        title={label}
      >
        {label}
      </h6>
    </div>
  );
};
