import { type IComponentProps } from '@/components/utils/interface';
import { IOption } from '../multi/interface';

export interface IRadioProps extends IComponentProps {
  onChange?: (event: TargetedEvent<HTMLInputElement>) => void;
  options?: IOption[];
  label?: string;
  onChange?: Function;
  value?: any;
  required?: boolean;
  disabled?: boolean;
}
