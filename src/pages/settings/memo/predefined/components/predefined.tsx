import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IPredefined } from '../utils/predefined.d';

export const columns: ColumnDef<IPredefined>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'h_description',
  },
  {
    id: 'type',
    accessorKey: 'type',
    size: 60,
    header: 'h_type',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'h_name',
  },
  {
    id: 'actions',
    size: 20,
    header: 'h_action',
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
