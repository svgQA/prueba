import { type TargetedEvent } from 'preact/compat';
import { type IComponentProps } from '@/components/utils/interface';
import { FieldMetaState } from 'react-final-form';
import { IOption } from '../multi/interface';

export interface ISelectedOptions extends IOption {
  id?: string;
}

export interface ISelectProps extends IComponentProps {
  onChange?: (event: TargetedEvent<HTMLSelectElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  label?: string;
  min?: string;
  max?: string;
  value?: string | number;
  step?: number;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  icon?: string;
  meta?: FieldMetaState<string>;
  end?: boolean;
  options?: any[];
  borderless?: boolean;
  thin?: boolean;
  tabIndex?: number;
  disabled?: boolean;
  optionValue?: string;
  optionLabel?: string;
}
