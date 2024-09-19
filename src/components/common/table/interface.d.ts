import { VNode } from 'preact';

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  search?: VNode;
}
