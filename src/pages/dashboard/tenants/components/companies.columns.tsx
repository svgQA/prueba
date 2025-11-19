import { ColumnDef } from '@tanstack/react-table';

export interface Tenant {
  id: string;
  name: string;
  description: string;
  manager_name: string;
  manager_email: string;
  manager_phone: string;
  external_id: string;
  platform_external_id: string;
  instance_id: string;
  status: string;
  message: string;
  created_at: string;
}

export const columns: ColumnDef<Tenant>[] = [
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
    id: 'description',
    accessorKey: 'description',
    size: 150,
    header: 'h_description',
    enableGrouping: true,
    cell: (info) => {
      const description = info.getValue() as string;
      return (
        <div className='w-full flex justify-center max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
          {description}
        </div>
      );
    },
  },
  {
    id: 'manager_name',
    accessorKey: 'manager_name',
    size: 120,
    header: 'l_manager_name',
  },
  {
    id: 'manager_email',
    accessorKey: 'manager_email',
    size: 150,
    header: 'l_manager_email',
  },
  {
    id: 'manager_phone',
    accessorKey: 'manager_phone',
    size: 120,
    header: 'l_manager_phone',
  },
  {
    id: 'instance_id',
    accessorKey: 'instance_id',
    size: 100,
    header: 'h_instance_id',
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 80,
    header: 'h_status',
  },
  {
    id: 'message',
    accessorKey: 'message',
    size: 150,
    header: 'message',
    cell: (info) => {
      const message = info.getValue() as string;
      return (
        <div className='w-full flex justify-center max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
          {message}
        </div>
      );
    },
  },
];
