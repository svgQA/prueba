import { type TargetedEvent } from 'preact/compat';
import { type IComponentProps } from '@/components/utils/interface';
import { FieldMetaState } from 'react-final-form';

export interface IInputProps extends IComponentProps {
  onChange?: (event: TargetedEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  onClick?: (event: any) => void;
  label?: string;
  min?: string;
  max?: string;
  value?: string | number;
  step?: number;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  icon?: string;
  type?:
    | 'text'
    | 'password'
    | 'number'
    | 'tel'
    | 'email'
    | 'time'
    | 'date'
    | 'datetime-local';
  meta?: FieldMetaState<string>;
  end?: boolean;
  borderless?: boolean;
  tabIndex?: number;
  thin?: boolean;
  button?: boolean;
  buttonIcon?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  normal?: boolean;
  disabled?: boolean;
}
