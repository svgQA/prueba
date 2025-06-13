import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRole } from '../roles';

export const columns: ColumnDef<IRole>[] = [
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
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='role-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='role-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
