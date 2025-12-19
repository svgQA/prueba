import { type IComponentProps } from '@/components/utils/interface';

export interface ISwitchProps extends IComponentProps {
  onChange?: (e: TargetedEvent<HTMLInputElement>) => void;
  onClick?: (e: TargetedEvent<HTMLInputElement>) => void;
  label?: string;
  value?: boolean;
  backgroundColor?: string; // Custom background color for the switch
  identifier?: string | number;
  disabled?: boolean;
  className?: string;
}
