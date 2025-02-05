import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IActivity } from '../activity';
import dayjs from 'dayjs';

export const columns: ColumnDef<IActivity>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'Id',
  },
  {
    id: 'start',
    accessorKey: 'start',
    size: 60,
    header: 'Inicio',
  },
  {
    id: 'end',
    accessorKey: 'end',
    size: 60,
    header: 'Fin',
  },
  {
    id: 'roundId',
    accessorKey: 'roundId',
    size: 60,
    header: 'Ronda',
  },
  {
    id: 'projectId',
    accessorKey: 'projectId',
    size: 60,
    header: 'Proyecto',
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 60,
    header: 'Estado',
  },
  {
    id: 'type',
    accessorKey: 'type',
    size: 60,
    header: 'Tipo',
  },
  {
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
