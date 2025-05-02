import { type IComponentProps } from '@/components/utils/interface';

export interface IButtonProps extends IComponentProps {
  label?: string;
  icon?: string;
  color?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: MouseEvent) => void;
  rounded?: boolean;
  full?: boolean;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  end?: boolean;
  borderless?: boolean;
  padding?: string;
  text?: string;
  textColor?: string;
  iconColor?: string;
  form?: string;
  big?: boolean;
  iconSize?: 'sm' | 'xsm' | 'xs' | 'xxs';
  unpadded?: boolean;
  selected?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  bold?: boolean;
}
