import { type IComponentProps } from '@/components/utils/interface';
import { modulesReport } from '@/types/form';
import { ColumnFiltersState } from '@tanstack/react-table';
import { VNode } from 'preact';

export type IKey = {
  label: string;
  id: string;
};

export interface ISearchProps extends IComponentProps {
  lenThreshold?: number;
  keys?: IKey[];
  value?: ColumnFiltersState;
  onChange?: (filters: ColumnFiltersState) => void;
  placeholder?: string;
  table?: any;
  group?: VNode;
  grouping?: boolean;
  disabled?: boolean;
  modules?: modulesReport;
}
