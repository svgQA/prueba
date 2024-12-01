import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import {
  ExpandableContentProps,
  PrioritySection,
} from '../expansible/expansible';

export interface IRowAction {
  id: number | string;
  type: string;
  action: string;
}

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  expandable?: (row: Row<T>) => VNode;
  unscroll?: boolean;
  unsettings?: boolean;
  visibility?: { [key: string]: boolean };
  onClickAction?: (action: IRowAction) => void;
}
