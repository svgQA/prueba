import { type IComponentProps } from '@/components/utils/interface';
import { IOption } from '../multi/interface';

export interface IDropdownOptions extends IOption {
  value: number | string;
  name?: string;
  id?: string;
}
export type DropdownOptionsKeys = keyof IDropdownOptions;

export interface IDropdownProps extends IComponentProps {
  label?: string;
  options: IDropdownOptions[];
  labelTag?: DropdownOptionsKeys;
  valueTag?: DropdownOptionsKeys;
  icon?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xsm';
  onChange?: (value: string | number) => void;
  meta?: FieldMetaState<string>;
  value?: string | number;
  disabled?: boolean;
  selectedTag?: string;
}
