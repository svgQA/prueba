import { VNode } from 'preact';
import { ColumnDef } from '@tanstack/react-table';
import {
  ExpandableContentProps,
  PrioritySection,
} from '../expansible/expansible';
import { ROW_ACTIONS } from './enum';

export interface IRowAction {
  id: number | string;
  type: string;
  action: ROW_ACTIONS;
}

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  expandable?: (row: Row<T>) => VNode;
  unscroll?: boolean;
  unsettings?: boolean;
  unsearch?: boolean;
  visibility?: { [key: string]: boolean };
  onClickAction?: (action: IRowAction) => void;
}
