import { ITask } from '@/types/shift';
import { VNode } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import { FieldMetaState } from 'react-final-form';

export interface IOption {
  value: number | string;
  label: string;
  icon?: string;
  type?: string;
}

export interface IMultiProps {
  label?: string;
  name?: string;
  icon?: string;
  onChange: (value: IOption[] | ITask[], name?: string) => void;
  buttonIcon?: string;
  buttonType?: 'button' | 'submit';
  id?: string;
  value?: IOption[] | ITask[];
  bottom?: boolean;
  placeholder?: string;
  onSelect?: (value: string) => void;
  getElement?: (value: IOption, index: number) => VNode;
  button?: boolean;
  ellipse?: number;
  scrollable?: boolean;
  meta?: FieldMetaState<any>;
  disabled?: boolean;
}
