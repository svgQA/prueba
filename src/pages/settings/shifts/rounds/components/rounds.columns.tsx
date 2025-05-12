import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Round } from '../utils/rounds';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Round>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nombre',
    enableGrouping: true,
  },
  {
    id: 'frequency',
    accessorKey: 'frequency',
    header: 'Frecuencia',
    enableGrouping: true,
  },
  {
    id: 'actions',
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
