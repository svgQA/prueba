export interface IChipProps {
  label: string;
  icon?: string;
  color?: string;
  width?: ChipSize;
  onDelete?: () => void;
}

export type ChipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export const sizeMap: Record<ChipSize, string> = {
  xs: 'w-16',
  sm: 'w-24',
  md: 'w-32',
  lg: 'w-40',
  xl: 'w-48',
  full: 'w-full'
};
