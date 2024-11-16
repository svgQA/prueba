import { type IComponentProps } from '@/components/utils/interface';

export interface IDropdownOptions {
  label: string;
  name?: string;
  id?: string;
  value?: string;
}
export type DropdownOptionsKeys = keyof IDropdownOptions;

export interface IDropdownProps extends IComponentProps {
  label?: string;
  options: IDropdownOptions[];
  labelTag?: DropdownOptionsKeys;
  valueTag?: DropdownOptionsKeys;
}
