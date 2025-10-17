import { ColumnDef } from '@tanstack/react-table';
import { IUserResponse } from '@/types/auth';
import { Badge } from '@/components/common/badge/badge';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export const columns: ColumnDef<IUserResponse>[] = [
  {
    id: 'name',
    header: 'h_name',
    accessorFn: (row) => `${row.name} ${row.surname}`,
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: 'h_id',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'h_email',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: 'h_phone',
  },
  {
    id: 'cardId',
    accessorKey: 'cardId',
    header: 'h_identification',
  },
  {
    id: 'country',
    accessorFn: (row) => row.extraData?.country,
    header: 'h_country',
  },
  {
    id: 'state',
    accessorFn: (row) => row.extraData?.state,
    header: 'h_state',
  },
  {
    id: 'city',
    accessorFn: (row) => row.extraData?.city,
    header: 'h_city',
  },
  {
    id: 'job',
    accessorFn: (row) => row.extraData?.job,
    header: 'h_job',
  },
  {
    id: 'area',
    accessorFn: (row) => row.extraData?.area,
    header: 'h_area',
  },
  {
    id: 'sucursal',
    accessorFn: (row) => row.extraData?.sucursal,
    header: 'h_sucursal',
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'h_created',
  },
  {
    id: 'connection',
    header: 'h_connection',
    cell: () => (
      <div className='flex flex-row justify-center'>
        <Badge label='active' bgColor='bg-primary' icon='067' />
      </div>
    ),
  },
  {
    id: 'actions',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id, cognitoId } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          {!cognitoId && (
            <ButtonAction
              id={id}
              type='form'
              action={ROW_ACTIONS.CREATE}
              label='create'
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
