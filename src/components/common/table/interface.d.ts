import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  search?: VNode;
  searchPlaceholder?: string;
  pageSize?: number;
  renderExpandedRow?: (row: T) => React.ReactNode;
}

export interface ITableSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  placeholder: string;
}
