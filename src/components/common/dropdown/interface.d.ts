import { type IComponentProps } from '@/components/utils/interface';

export interface IDropdownElement {
  label?: string;
  name?: string;
  id?: string;
  value?: string;
}
export type DropdownElementKeys = keyof IDropdownElement;

export interface IDropdownProps extends IComponentProps {
  label?: string;
  elements: IDropdownElement[];
  labelTag?: DropdownElementKeys;
  valueTag?: DropdownElementKeys;
}
