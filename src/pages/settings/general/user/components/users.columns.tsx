import { ColumnDef } from '@tanstack/react-table';
import { IUserResponse } from '@/types/auth';
import { Badge } from '@/components/common/badge/badge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export const columns: ColumnDef<IUserResponse>[] = [
  {
    id: 'name',
    header: 'Nombre',
    accessorFn: (row) => `${row.name} ${row.surname}`,
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'Teléfono',
  },
  {
    id: 'cardId',
    accessorKey: 'cardId',
    header: 'ID Tarjeta',
  },
  {
    id: 'country',
    accessorFn: (row) => row.extraData?.country,
    header: 'País',
  },
  {
    id: 'state',
    accessorFn: (row) => row.extraData?.state,
    header: 'Estado',
  },
  {
    id: 'city',
    accessorFn: (row) => row.extraData?.city,
    header: 'Ciudad',
  },
  {
    id: 'job',
    accessorFn: (row) => row.extraData?.job,
    header: 'Trabajo',
  },
  {
    id: 'area',
    accessorFn: (row) => row.extraData?.area,
    header: 'Área',
  },
  {
    id: 'sucursal',
    accessorFn: (row) => row.extraData?.sucursal,
    header: 'Sucursal',
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Fecha de Creación',
  },
  {
    id: 'connection',
    header: 'Conexión',
    cell: () => (
      <div className='flex flex-row justify-center'>
        <Badge label='active' bgColor='bg-primary' icon='067' />
      </div>
    ),
  },
  {
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id, cognitoId } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          {!cognitoId && (
            <ButtonAction
              id={id}
              type='form'
              action={ROW_ACTIONS.CREATE}
              label='Create Account'
            />
          )}
          <ButtonAction
            id={id}
            type='shift'
            action={ROW_ACTIONS.UPDATE}
            icon='123'
          />
          <ButtonAction
            id={id}
            type='shift'
            action={ROW_ACTIONS.DELETE}
            icon='053'
          />
        </div>
      );
    },
  },
];
