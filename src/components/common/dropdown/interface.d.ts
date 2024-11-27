import { type IComponentProps } from '@/components/utils/interface';
import { IOption } from '../interface';

export interface IDropdownOptions extends IOption {
  name?: string;
  id?: string;
}
export type DropdownOptionsKeys = keyof IDropdownOptions;

export interface IDropdownProps extends IComponentProps {
  label?: string;
  options: IDropdownOptions[];
  labelTag?: DropdownOptionsKeys;
  valueTag?: DropdownOptionsKeys;
}
