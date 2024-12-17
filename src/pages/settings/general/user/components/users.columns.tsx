import { ColumnDef } from '@tanstack/react-table';
import { User } from '../utils/user';
import { Badge } from '@/components/common';

export const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Nombre',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    id: 'id',
    accessorKey: 'personalID',
    header: 'Identificación',
  },
  {
    id: 'email',
    accessorKey: 'workerEmail',
    header: 'Email',
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: 'Compañia',
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: 'Departamento',
  },
  {
    id: 'connection',
    accessorKey: 'connection',
    header: 'Conexión',
    cell: (info) => (
      <div className='flex flex-row justify-center'>
        <Badge
          label={info.getValue() as string}
          bgColor='bg-primary'
          icon='067'
        />
      </div>
    ),
  },
];
