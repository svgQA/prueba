import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { INovelty } from '../service';

export const columns: ColumnDef<INovelty>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'Nombre',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'Descripción',
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    size: 180,
    header: 'prioridad',
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <span className={`px-2 py-1 rounded bg-secondary text-white`}>
          {value}
        </span>
      );
    },
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
