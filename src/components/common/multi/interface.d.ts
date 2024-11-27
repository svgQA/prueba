import { VNode } from 'preact';
import { PropsWithChildren } from 'preact/compat';

export interface IOption {
  value: number | string;
  label: string;
}

export interface IMultiProps {
  label: string;
  name: string;
  icon?: string;
  id?: string;
  value?: IOption[];
  bottom?: boolean;
  onChange: (value: IOption[], name: string) => void;
  placeholder?: string;
  getElement?: (value: IOption, index: number) => VNode;
}
