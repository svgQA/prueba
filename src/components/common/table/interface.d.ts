import { VNode } from 'preact';
import { ColumnDef, Row } from '@tanstack/react-table'; // AGREGADO Row
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
  expandable?: (row: T, currentColumnName?: string) => VNode; // Aquí row es el dato original, no hace falta Row<T> si no lo usas
  unscroll?: boolean;
  unsettings?: boolean;
  unsearch?: boolean;
  visibility?: { [key: string]: boolean };
  onClickAction?: (action: IRowAction) => void;
  button?: VNode;
  showExpandableIcon?: Boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onNotifications?: boolean;
  hasNotifications?: boolean;
}
