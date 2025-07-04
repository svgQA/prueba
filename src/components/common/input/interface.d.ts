import { type TargetedEvent } from 'preact/compat';
import { type IComponentProps } from '@/components/utils/interface';
import { FieldMetaState } from 'react-final-form';

export interface IInputProps<T> extends IComponentProps {
  name: string;
  onChange?: (event: TargetedEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  onClick?: (event: any) => void;
  label?: string;
  min?: string | number; // ✅ actualizado
  max?: string | number; // ✅ actualizado
  value?: string | number | Date | undefined;
  step?: number;
  pattern?: string;
  required?: boolean;
  error?: string;
  warning?: string;
  placeholder?: string;
  icon?: string;
  labelLeft?: boolean;
  rounded?: boolean;
  float?: boolean;
  unicon?: boolean;
  type?:
    | 'text'
    | 'password'
    | 'number'
    | 'tel'
    | 'email'
    | 'time'
    | 'date'
    | 'datetime-local'
    | 'search'
    | 'url'
    | 'file'
    | 'color'
    | 'range'
    | 'keywords'
    | 'checkbox';
  meta?: FieldMetaState<T>;
  end?: boolean;
  borderless?: boolean;
  tabIndex?: number;
  thin?: boolean;
  button?: boolean;
  buttonIcon?: string;
  buttonType?: 'button' | 'submit' | 'reset';
  normal?: boolean;
  disabled?: boolean;
  readOnly?: boolean; // ✅ agregado
  className?: string;
  ref?: React.RefObject<HTMLInputElement>;
  onInput?: (event: TargetedEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string; // ✅ agregado
  paddingVertical?: string;
}
