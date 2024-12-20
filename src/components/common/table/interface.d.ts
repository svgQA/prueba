import { VNode } from 'preact';
import { ColumnDef, Row } from '@tanstack/react-table'; // AGREGADO Row
import {
  ExpandableContentProps,
  PrioritySection,
} from '../expansible/expansible';

export enum ROW_ACTIONS {
  UPDATE,
  CREATE,
  DELETE,
  REPORT,
}

export interface IRowAction {
  id: number | string;
  type: string;
  action: ROW_ACTIONS;
}

export interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  expandable?: (row: T) => VNode; // Aquí row es el dato original, no hace falta Row<T> si no lo usas
  unscroll?: boolean;
  unsettings?: boolean;
  visibility?: { [key: string]: boolean };
  onClickAction?: (action: IRowAction) => void;
}

// import { VNode } from 'preact';
// import { ColumnDef } from '@tanstack/react-table';
// import {
//   ExpandableContentProps,
//   PrioritySection,
// } from '../expansible/expansible';

// export enum ROW_ACTIONS {
//   UPDATE,
//   CREATE,
//   DELETE,
//   REPORT,
// }

// export interface IRowAction {
//   id: number | string;
//   type: string;
//   action: ROW_ACTIONS;
// }

// export interface ITableProps<T> {
//   data: T[];
//   columns: ColumnDef<T>[];
//   pageSize?: number;
//   expandable?: (row: Row<T>) => VNode;
//   unscroll?: boolean;
//   unsettings?: boolean;
//   visibility?: { [key: string]: boolean };
//   onClickAction?: (action: IRowAction) => void;
// }
