import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Round } from '../utils/rounds';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Round>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: 'Nombre',
    enableGrouping: true,
  },
  {
    id: 'frequency',
    accessorKey: 'frequency',
    size: 180,
    header: 'Frecuencia',
    enableGrouping: true,
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
            data-type='shift'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='shift'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
