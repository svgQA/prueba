import { type IComponentProps } from '@/components/utils/interface';
import { VNode } from 'preact';

export interface IFilterModel {
  key: string;
  value: string[];
}

export interface ISearchProps extends IComponentProps {
  lenThreshold?: number;
  keys?: string[];
  value?: IFilterModel[];
  onChange?: (filters: IFilterModel[]) => void;
  placeholder?: string;
}
