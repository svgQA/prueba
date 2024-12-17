import { PropsWithChildren } from 'preact/compat';

export interface IBadgeProps {
  label: string;
  icon?: string;
  bgColor?: string;
  color?: string;
}

export interface IFloatBadgeProps extends PropsWithChildren {
  label?: string;
}
