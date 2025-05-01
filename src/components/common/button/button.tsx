import { type FunctionComponent } from 'preact';
import { type IButtonProps } from './interface';

export const Button: FunctionComponent<IButtonProps> = ({
  label,
  id,
  name,
  type = 'button',
  icon,
  onClick,
  rounded,
  full,
  className,
  loading,
  disabled,
  end,
  border = false,
  padding = 'px-2 md:px-4 mx-1',
  text = 'text-sm md:text-base',
  textColor = '',
  form,
  big,
  iconColor = '',
  textAlign = 'center',
  bold = true, 
}: IButtonProps) => {
  const getJustify = () => {
    switch (textAlign) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-center';
    }
  };

  return (
    <button
      id={`${id}-button`}
      name={name}
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      form={form}
      className={`${rounded ? 'rounded-full px-1 md:px-2' : 'rounded px-2 md:px-4'} ${
        full ? 'w-full' : ''
      } ${padding} ${text} h-fit items-center inline-flex ${bold ? 'font-bold' : 'font-normal'} ${className} ${
        border
          ? 'border border-b-light-dark dark:border-b-dark-light'
          : 'border-none'
      }`}
    >
      {icon && !end && (
        <span
          className={`left-0 px-1 size vox-icon vx-icon-${icon} hidden sm:inline ${iconColor}`}
        />
      )}

      {label && !rounded && (
        <div className={`flex flex-row ${getJustify()} items-center w-full md:w-auto`}>
          <p
            className={`capitalize text-${textAlign} ${textColor} ${big ? 'py-1' : ''}`}
          >
            {label}
          </p>
          <span
            className={`left-0 px-1 vx-icon vx-logo ${loading ? 'visible' : 'invisible'}`}
          />
        </div>
      )}

      {icon && end && (
        <span
          className={`left-0 px-1 size vox-icon vx-icon-${icon} hidden sm:inline ${iconColor}`}
        />
      )}
    </button>
  );
};
