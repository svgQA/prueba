import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import {
  ExpandableContentProps,
  PrioritySection,
} from '../expansible/expansible';

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  expandable?: (row: Row<T>) => VNode;
}
