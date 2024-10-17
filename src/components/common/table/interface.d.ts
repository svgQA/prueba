import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  search?: VNode;
  pageSize?: number;
}

// export interface ITableSearchProps {
//   globalFilter: string;
//   setGlobalFilter: (value: string) => void;
//   placeholder: string;
// }
