import { FunctionalComponent } from 'preact';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  className?: string;
  square?: boolean;
  icon?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
}

const sizeMap = {
  sm: 'w-8 h-8 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-32 h-32 text-5xl',
  auto: 'w-full h-full',
};
const iconSizeMap = {
  sm: 'size-sm',
  md: 'size-md',
  lg: 'size-xl',
  xl: 'size-2xl',
  auto: 'size-xl',
};

export const Avatar: FunctionalComponent<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  square = false,
  icon,
}) => {
  const shape = square ? 'rounded' : 'rounded-full';
  const classes = `
    flex items-center justify-center ${shape} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold overflow-hidden text-center
    ${sizeMap[size] || sizeMap.md} ${className} ${icon ? 'px-6' : ''}
  `;
  const initial = name ? name.trim().charAt(0).toUpperCase() : '';

  if (icon) {
    return (
      <div className={classes}>
        <span
          className={`vx-icon vx-icon-${icon} ${iconSizeMap[size] || 'size-md'} text-gray-500 dark:text-gray-200`}
        />
      </div>
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={classes + ' object-cover'}
        loading='lazy'
      />
    );
  }

  return <div className={classes}>{initial}</div>;
};
