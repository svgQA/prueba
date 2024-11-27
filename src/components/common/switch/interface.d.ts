import { type IComponentProps } from '@/components/utils/interface';

export interface ISwitchProps extends IComponentProps {
  checked?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
}
