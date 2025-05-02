import { PropsWithChildren } from 'preact/compat';

export interface IBadgeProps {
  label?: string;
  icon?: string;
  bgColor?: string;
  color?: string;
  style?: React.CSSProperties;
  textColor?: string;
  outlined?: boolean;
  borderColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  full?: boolean;
  borderless?: boolean;
  status?: 'error' | 'success' | 'warning' | 'info';
}

export interface IFloatBadgeProps extends PropsWithChildren {
  label?: string | number;
  size?: string;
  position?: string;
  color?: string;
}
