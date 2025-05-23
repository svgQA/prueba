import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  size = 'xs',
  status,
  full = false,
  borderless = false,
  outline = false,
  width = 'w-32',
  onClick,
}: IBadgeProps) => {
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
        text-${size} items-center capitalize px-3 flex rounded-md py-1
        ${icon ? 'justify-between' : 'justify-center'} text-base
        ${full ? 'w-full' : width}
        ${
          outline
            ? `border ${getStatusColor(status)} bg-transparent`
            : `${borderless ? 'border-none' : 'border border-gray-100 dark:border-gray-700'} 
             ${
               !icon
                 ? status === 'error'
                   ? 'bg-error'
                   : status === 'success'
                     ? 'bg-secondary'
                     : status === 'warning'
                       ? 'bg-orange-500'
                       : status === 'info'
                         ? 'bg-primary'
                         : 'bg-white dark:bg-b-dark-light'
                 : 'bg-white dark:bg-b-dark-light'
             }`
        }
      `}
      onClick={onClick}
    >
      {icon ? (
        <>
          <span
            className={`vx-icon vx-icon-${icon} size-${size} mx-1 ${status === 'error' ? 'text-error' : status === 'success' ? 'text-secondary' : status === 'warning' ? 'text-orange-500' : status === 'info' ? 'text-primary' : ''}`}
          ></span>
          <span>{label}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </span>
  );
};
