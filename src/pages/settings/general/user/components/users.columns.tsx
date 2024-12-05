import { ColumnDef } from '@tanstack/react-table';
import { User } from '../utils/user';
import { Badge } from '@/components/common';

export const columns: ColumnDef<User>[] = [
  {
    header: 'Nombre',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  },
  {
    accessorKey: 'personalID',
    header: 'Identificación',
  },
  {
    accessorKey: 'workerEmail',
    header: 'Email',
  },
  {
    accessorKey: 'company',
    header: 'Compañia',
  },
  {
    accessorKey: 'department',
    header: 'Departamento',
  },
  {
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
