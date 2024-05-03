import { INPUTS_STATUS, uca_variable } from '@/types/types';
import { type TargetedEvent } from 'preact/compat';
import { IComponentProps } from '../interface';

export interface IInputProps extends IComponentProps {
  onChange?: (event: TargetedEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  label: string;
  min?: string;
  max?: string;
  value?: string | number;
  step?: number;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  icon?: string;
  type?: 'text' | 'password' | 'number' | 'tel' | 'email';
}
