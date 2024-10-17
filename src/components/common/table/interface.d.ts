import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import {
  ExpandableContentProps,
  PrioritySection,
} from '../expansible/expansible';

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  search?: VNode;
  // searchPlaceholder?: string;
  pageSize?: number;
  // renderExpandedRow?: (row: T) => React.ReactNode;
  // expandableData?: (ExpandableContentProps['data'] | PrioritySection[])[];
}

export interface ITableSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  placeholder: string;
}
