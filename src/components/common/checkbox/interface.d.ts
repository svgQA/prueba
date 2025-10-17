import { type IComponentProps } from '@/components/utils/interface';
import { IOption } from '../multi/interface';
import { IRadioProps } from '../radio/interface';

export interface ICheckboxProps extends IRadioProps {
  checked?: boolean;
}
