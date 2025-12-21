import { type FunctionComponent } from 'preact';
import { type IBadgeProps } from './interface';
import { useTranslation } from 'react-i18next';
import { TextEllipsis } from '../text-ellipsis';

const SIZE_CLASSES: Record<string, string> = {
  xs: 'text-xs py-1 px-3',
  sm: 'text-sm py-1.5 px-3',
  md: 'text-base py-2 px-4',
  lg: 'text-lg py-2.5 px-4',
};

// Colores por estado (separados por variante para evitar choques)
const STATUS_OUTLINE: Record<string, string> = {
  error: 'border-error text-error',
  success: 'border-secondary text-secondary',
  warning: 'border-orange-500 text-orange-500',
  info: 'border-primary text-primary',
  default:
    'border-gray-400 text-gray-600 dark:border-gray-600 dark:text-gray-300',
};

const STATUS_FILLED: Record<string, string> = {
  error: 'border-error bg-error text-white',
  success: 'border-secondary bg-ternary text-white',
  warning: 'border-orange-500 bg-orange-500 text-white',
  info: 'border-primary bg-primary text-white',
  default:
    'border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-b-dark-light dark:text-gray-200',
};

export const Badge: FunctionComponent<IBadgeProps> = ({
  label,
  icon,
  size = 'xs',
  status,
  full = false,
  borderless = false,
  outline = false,
  onRemove,
  onClick,
  count,
  width,
}: IBadgeProps) => {
  if (!label) return null;
  const { t } = useTranslation();

  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.xs;

  const base =
    'relative inline-flex items-center rounded-md capitalize select-none';

  const layout = icon ? 'justify-between gap-2' : 'justify-center';

  const clickable = onClick ? 'cursor-pointer' : '';

  const w = full ? 'w-full' : (width ?? ''); // width debería venir como clase (ej: "w-40")
  const removePad = onRemove ? 'pr-8' : '';

  // border base por variante
  const borderBase = borderless ? 'border-0' : 'border';

  // status por variante
  const statusKey = status ?? 'default';
  const statusClass = outline
    ? (STATUS_OUTLINE[statusKey] ?? STATUS_OUTLINE.default)
    : (STATUS_FILLED[statusKey] ?? STATUS_FILLED.default);

  // fondo por variante
  const variantBg = outline ? 'bg-transparent' : ''; // filled ya trae bg en STATUS_FILLED

  return (
    <span
      className={[
        base,
        sizeClass,
        'px-3', // si ya viene en SIZE_CLASSES puedes quitar esta línea
        layout,
        clickable,
        w,
        removePad,
        borderBase,
        statusClass,
        variantBg,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
    >
      {icon && (
        <span className={`vx-icon vx-icon-${icon} size-${size} mr-2 ml-1`} />
      )}

      <TextEllipsis
        text={count ? `${count} ${t(label)}` : t(label)}
        maxWidth='150px'
      />

      {onRemove && (
        <span
          className='vx-icon vx-icon-045 size-4 mx-1 cursor-pointer right-0 absolute top-1'
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </span>
  );
};
