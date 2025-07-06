import { cdn_service_url } from '@/env.config';
import { useUserStore } from '@/store/slices';
import { IPresignedRequest } from '@/types/file';
import { FunctionalComponent } from 'preact';

interface AvatarProps {
  src?: string | IPresignedRequest;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  className?: string;
  square?: boolean;
  icon?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
}

const sizeMap = {
  sm: 'min-w-8 max-w-8 min-h-8 max-h-8 text-base',
  md: 'min-w-12 max-w-12 min-h-12 max-h-12 text-xl',
  lg: 'min-w-20 max-w-20 min-h-20 max-h-20 text-3xl',
  xl: 'min-w-32 max-w-32 min-h-32 max-h-32 text-5xl',
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
  const { getTenant, getCompanyId } = useUserStore();
  const getUrl = (file: IPresignedRequest) => {
    const validation = `${cdn_service_url}/${getTenant()}/${getCompanyId()}/${file.area}/${file.uuid}-${file.name}`;
    return validation;
  };
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
          className={`vx-icon vx-icon-${icon} ${iconSizeMap[size] || 'size-md'} text-gray-500 dark:text-gray-200 font-thin`}
        />
      </div>
    );
  }

  if (typeof src === 'string') {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={classes + ' object-cover'}
        loading='lazy'
      />
    );
  }

  if (typeof src === 'object' && src.uuid) {
    return (
      <img
        src={getUrl(src)}
        alt={name || 'avatar'}
        className={classes + ' object-cover'}
        loading='lazy'
      />
    );
  }

  return <div className={classes}>{initial}</div>;
};
