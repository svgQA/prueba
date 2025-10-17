import { ColumnDef } from '@tanstack/react-table';

export type NColumnDef<T> = ColumnDef<T> & {
  clickable?: boolean;
};
