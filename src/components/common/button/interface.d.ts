import { type IComponentProps } from '@/components/utils/interface';

export interface IButtonProps extends IComponentProps {
  label?: string;
  icon?: string;
  color?: string;
  type: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  rounded?: boolean;
  full?: boolean;
  className?: string;
}
