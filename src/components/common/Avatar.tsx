import { useUserStore } from '@/store/slices';
import { IPresignedRequest } from '@/types/file';
import { getUrlImage } from '@/utils/utilities/presigned';
import { FunctionalComponent } from 'preact';

interface AvatarProps {
  src?: string | IPresignedRequest;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  className?: string;
  square?: boolean;
  icon?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  toolTipLabel?: string;
  bgColor?: string;
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
  toolTipLabel = '',
  icon,
  bgColor = 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
}) => {
  const { getTenant, getCompanyId } = useUserStore();
  const shape = square ? 'rounded' : 'rounded-full';
  const classes = `
    flex items-center justify-center ${shape} font-bold overflow-hidden text-center
    ${sizeMap[size] || sizeMap.md} ${className} ${bgColor} ${icon ? 'px-6' : ''} ${toolTipLabel ? 'cursor-pointer' : ''}
  `;
  const initial = name ? name.trim().charAt(0).toUpperCase() : '';

  if (icon) {
    return (
      <div className={classes} title={toolTipLabel}>
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
        title={toolTipLabel}
      />
    );
  }

  if (src !== null && typeof src === 'object' && src.uuid) {
    const _url = getUrlImage(src, getTenant(), getCompanyId());
    return (
      <img
        src={_url}
        alt={name || 'avatar'}
        className={classes + ' object-cover'}
        loading='lazy'
        title={toolTipLabel}
      />
    );
  }

  return (
    <div className={classes} title={toolTipLabel}>
      {initial}
    </div>
  );
};
