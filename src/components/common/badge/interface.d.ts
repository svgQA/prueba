import { PropsWithChildren } from 'preact/compat';

export interface IBadgeProps {
  label: string;
  icon?: string;
  bgColor?: string;
  color?: string;
  style?: React.CSSProperties;
  textColor?: string;
}

export interface IFloatBadgeProps extends PropsWithChildren {
  label?: string;
}
