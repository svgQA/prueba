import { ColumnDef } from '@tanstack/react-table';
import { IKeyResponse } from '@/types/key/key.response';

export const columns: ColumnDef<IKeyResponse>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'h_name',
    size: 40,
  },
  {
    id: 'key',
    accessorKey: 'key',
    header: 'h_key',
    size: 60,
  },
];
