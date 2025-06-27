import { type FunctionComponent } from 'preact';
import { type IButtonProps } from './interface';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'preact/hooks';
import { getCurrentPermissions } from '@/store/signals/access/permission';

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
  mode,
  keyName = '',
  transparent = false,
}: IButtonProps) => {
  const { t } = useTranslation();
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

  const allowButton = useMemo(() => {
    if (keyName === '') return true;
    const permissions = getCurrentPermissions();
    return permissions[keyName];
  }, [keyName]);

  const getBackgroundColor = () => {
    if (mode) {
      return `bg-${mode} text-white`;
    }
    return transparent
      ? 'bg-transparent'
      : selected
        ? `${selectedColor} text-white`
        : 'bg-white dark:bg-b-dark-dark text-primary dark:text-gray-200';
  };
  return (
    <>
      {allowButton && (
        <button
          id={`${id}-button`}
          name={name}
          type={type}
          onClick={onClick}
          form={form}
          disabled={loading || disabled}
          className={`
          ${square ? 'w-8 h-8' : ''}
          ${unpadded ? 'p-1' : 'p-2'}
          ${rounded ? 'rounded-full' : 'rounded'}
          hover:bg-opacity-70
          max-h-9
          transition-colors duration-150
          ${borderless ? 'border-none' : 'border border-gray-200 dark:border-gray-700'}
          ${full ? 'w-full' : ''}
          ${getBackgroundColor()}
          flex items-center text-center disabled:opacity-50
          ${icon && label ? 'justify-start' : 'justify-center'}
          ${label ? 'pr-4' : ''}
        `}
        >
          {icon && !end && (
            <span
              className={`${mode ? 'text-white' : selected ? 'text-white' : 'text-primary'} left-0 px-1 size-${iconSize} vx-icon vx-icon-${icon} hidden sm:inline ${iconColor} ${label ? 'mr-2' : ''}`}
            />
          )}

          {label && !rounded && (
            <div
              className={`flex flex-row ${getJustify()} items-center w-full md:w-auto`}
            >
              <p
                className={`capitalize max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis w-full text-${textAlign} ${textColor} ${big ? 'py-1' : ''} ${icon && end ? 'pl-2' : ''}`}
              >
                {t(label)}
              </p>
            </div>
          )}

          {icon && end && (
            <span
              className={`${mode ? 'text-white' : selected ? 'text-white' : 'text-primary'} left-0 px-1 size-${iconSize} vox-icon vx-icon-${icon} hidden sm:inline ${iconColor}`}
            />
          )}
        </button>
      )}
    </>
  );
};
