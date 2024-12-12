import { VNode } from 'preact';
import { PropsWithChildren } from 'preact/compat';

export interface IOption {
  value: number;
  label: string;
}

export interface IMultiProps {
  label?: string;
  name: string;
  icon?: string;
  buttonIcon?: string;
  buttonType?: 'button' | 'submit';
  id?: string;
  value?: IOption[];
  bottom?: boolean;
  onChange: (value: IOption[], name: string) => void;
  placeholder?: string;
  onSelect?: () => void;
  getElement?: (value: IOption, index: number) => VNode;
  button?: boolean;
  ellipse?: number;
  scrollable?: boolean;
}
