import { type IComponentProps } from '@/components/utils/interface';

export interface IButtonMenuProps extends IComponentProps {
  label: string;
  icon?: string;
  small?: boolean;
  onClick?: () => void;
}
