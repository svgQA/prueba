import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';
import { useTranslation } from 'react-i18next';
import { TextEllipsis } from '../text-ellipsis';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  size = 'xs',
  status,
  full = false,
  borderless = false,
  outline = false,
  width = 'w-32',
  onRemove,
  onClick,
  count,
}: IBadgeProps) => {
  if (!label) return null;
  const { t } = useTranslation();
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'error':
        return 'border-error text-error';
      case 'success':
        return 'border-secondary text-secondary';
      case 'warning':
        return 'border-orange-500 text-orange-500';
      case 'info':
        return 'border-primary text-primary';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <span
      className={`
        relative text-${size} items-center capitalize px-3 flex rounded-md py-1
        ${icon ? 'justify-between' : 'justify-center'} text-base
        ${full ? 'w-full' : width}
        ${onRemove ? 'pr-8' : ''}
        ${
          outline
            ? `border ${getStatusColor(status)} bg-transparent`
            : `${borderless ? 'border-none' : 'border border-gray-100 dark:border-gray-700'}
             ${
               status === 'error'
                 ? 'bg-error'
                 : status === 'success'
                   ? 'bg-secondary'
                   : status === 'warning'
                     ? 'bg-orange-500'
                     : status === 'info'
                       ? 'bg-ternary'
                       : 'bg-white dark:bg-b-dark-light'
             }`
        }
      `}
      onClick={onClick}
    >
      {icon ? (
        <>
          <span
            className={`vx-icon vx-icon-${icon} size-${size} mr-2 ml-1`}
          ></span>
          <TextEllipsis
            text={count ? `${count} ${t(label)}` : t(label)}
            maxWidth='150px'
          ></TextEllipsis>
        </>
      ) : (
        <TextEllipsis
          text={count ? `${count} ${t(label)}` : t(label)}
          maxWidth='150px'
        ></TextEllipsis>
      )}
      {onRemove && (
        <span
          className='vx-icon vx-icon-045 size-4 mx-1 cursor-pointer size-sm right-0 absolute top-1'
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        ></span>
      )}
    </span>
  );
};
