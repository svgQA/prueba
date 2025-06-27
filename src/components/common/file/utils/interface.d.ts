import { type TargetedEvent } from 'preact/compat';
import { type IComponentProps } from '@/components/utils/interface';
import { FieldMetaState } from 'react-final-form';
import { IPresignedRequest } from '@/types/file';
import { AllowedAreaTypes } from '@/types';
import { MapPoint } from '../../map/interface';

export interface IFileProps extends IComponentProps {
  onChange?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: KeyboardEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  label?: string;
  min?: string;
  max?: string;
  step?: number;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  icon?: string;
  type?: 'text' | 'password' | 'number' | 'tel' | 'email' | 'time' | 'date';
  meta?: FieldMetaState<string>;
  end?: boolean;
  borderless?: boolean;
  tabIndex?: number;
  thin?: boolean;
  accept: string;
  multiple?: boolean;
  disabled?: boolean;
  value: IPresignedRequest[];
  area?: AllowedAreaTypes;
}

export interface Attachment {
  url: string;
  name: string;
  type: 'image' | 'file';
}

export interface ShowFilesProps {
  resources?: IPresignedRequest[];
  isSender?: boolean;
  removeFile?: (uuid: string) => void;
  alertEmpty?: boolean;
  mapPoint?: MapPoint;
}
