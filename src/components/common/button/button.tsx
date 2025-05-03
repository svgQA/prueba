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
  loading,
  disabled,
  end,
  borderless = false,
  textColor = '',
  form,
  big,
  iconColor = '',
  iconSize = 'sm',
  full = false,
  unpadded = false,
  selected = false,
  textAlign = 'center',
  square = false,
  selectedColor = 'bg-primary',
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
      className={`
        ${square ? 'w-8 h-8' : ''}
        ${unpadded ? 'p-1' : 'p-2'}
        ${rounded ? 'rounded-full' : 'rounded'}
        text-primary dark:text-gray-200
        hover:bg-opacity-70
        transition-colors duration-150
        ${borderless ? 'border-none' : 'border border-gray-200 dark:border-gray-700'}
        ${full ? 'w-full' : ''}
        ${selected ? `${selectedColor} text-white` : 'bg-white dark:bg-gray-800'}
        flex items-center text-center disabled:opacity-50
        ${icon && label ? 'justify-start' : 'justify-center'}
      `}
      // ${bold ? 'font-bold' : 'font-normal'}
      // {`
      //   ${rounded ? 'rounded-full px-1 md:px-2' : 'rounded px-2 md:px-4'}
      //   ${full ? 'w-full' : ''}
      //   ${padding} ${text} h-fit items-center justify-center inline-flex font-bold ${className}
      //   ${border ? 'border border-gray-200 dark:border-gray-700' : 'border-none'}
      //   bg-white dark:bg-gray-800
      //   text-gray-700 dark:text-gray-200
      //   hover:bg-gray-50 dark:hover:bg-gray-700
      //   transition-colors duration-150
      // `}
    >
      {icon && !end && (
        <span
          className={`${selected ? 'text-white' : 'text-primary'} left-0 px-1 size-${iconSize} vx-icon vx-icon-${icon} hidden sm:inline ${iconColor} ${label ? 'mr-2' : ''}`}
        />
      )}

      {label && !rounded && (
        <div
          className={`flex flex-row ${getJustify()} items-center w-full md:w-auto`}
        >
          <p
            className={`capitalize w-full text-${textAlign} ${textColor} ${big ? 'py-1' : ''}`}
          >
            {label}
          </p>
        </div>
      )}

      {icon && end && (
        <span
          className={`${selected ? 'text-white' : 'text-primary'} left-0 px-1 size-${iconSize} vox-icon vx-icon-${icon} hidden sm:inline ${iconColor} ${label ? 'ml-2' : ''}`}
        />
      )}
    </button>
  );
};
