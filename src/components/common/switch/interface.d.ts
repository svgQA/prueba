import { type IComponentProps } from '@/components/utils/interface';

export interface ISwitchProps extends IComponentProps {
  onChange?: (value: boolean) => void;
  label?: string;
  value?: boolean;
}
