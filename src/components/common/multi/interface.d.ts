import { ITask } from '@/types/shift';
import { VNode } from 'preact';
import { PropsWithChildren } from 'preact/compat';
import { FieldMetaState } from 'react-final-form';

export interface IOption {
  value: number | string;
  label: string;
}

export interface IMultiProps {
  label?: string;
  name: string;
  icon?: string;
  buttonIcon?: string;
  buttonType?: 'button' | 'submit';
  id?: string;
  value?: IOption[] | ITask[];
  bottom?: boolean;
  onChange: (value: IOption[], name: string) => void;
  placeholder?: string;
  onSelect?: () => void;
  getElement?: (value: IOption, index: number) => VNode;
  button?: boolean;
  ellipse?: number;
  scrollable?: boolean;
  meta?: FieldMetaState<any>;
}
