import { ColumnDef } from '@tanstack/react-table';

export interface Instance {
  id: string;
  name: string;
  url: string;
  count: number;
  created_at: string;
  updated_at: string;
  status: boolean;
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const columns: ColumnDef<Instance>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 120,
    header: 'h_name',
    enableGrouping: true,
  },
  {
    id: 'count',
    accessorKey: 'count',
    size: 80,
    header: 'h_count',
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 80,
    header: 'h_status',
    cell: (info) => {
      const status = info.getValue() as boolean;
      return status ? 'Active' : 'Inactive';
    },
  },
];
