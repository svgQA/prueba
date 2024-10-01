import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  search?: VNode;
  searchPlaceholder?: string;
  pageSize?: number;
}

export interface ITableSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  placeholder: string;
}
// import { VNode } from 'preact';

// export interface ITableProps<T> {
//   data: T[];
//   columns: ColumnDef<T>[];
//   search?: VNode;
// }
