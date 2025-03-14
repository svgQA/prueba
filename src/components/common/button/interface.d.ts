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
  border?: boolean;
  padding?: string;
  text?: string;
  textColor?: string;
  form?: string;
}
