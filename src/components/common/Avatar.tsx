import { FunctionalComponent } from 'preact';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  className?: string;
  square?: boolean;
}

const sizeMap = {
  sm: 'w-8 h-8 text-base',
  md: 'w-12 h-12 text-xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-32 h-32 text-5xl',
  auto: 'w-full h-full',
};

export const Avatar: FunctionalComponent<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
  square = false,
}) => {
  const shape = square ? 'rounded' : 'rounded-full';
  const classes = `
    flex items-center justify-center ${shape} bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold overflow-hidden
    ${sizeMap[size] || sizeMap.md} ${className}
  `;
  const initial = name ? name.trim().charAt(0).toUpperCase() : '';

  return src ? (
    <img
      src={src}
      alt={name || 'avatar'}
      className={classes + ' object-cover'}
      loading='lazy'
    />
  ) : (
    <div className={classes}>{initial}</div>
  );
};
