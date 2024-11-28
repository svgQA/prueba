import { type IComponentProps } from '@/components/utils/interface';

export interface ISwitchProps extends IComponentProps {
  onChange?: (e: TargetedEvent<HTMLInputElement>) => void;
  label?: string;
  value?: boolean;
}
