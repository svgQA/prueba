import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IClientResponse } from '@/types/user/user.response';

export const columns: ColumnDef<IClientResponse>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'h_name',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'h_description',
    cell: (info) => {
      const value = info.getValue() as string;
      return (
        <div className='max-w-[300px]'>
          <span className='block truncate' title={value}>
            {value}
          </span>
        </div>
      );
    },
  },
  {
    id: 'email',
    accessorKey: 'email',
    size: 60,
    header: 'h_email',
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    size: 60,
    header: 'h_phone',
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
            data-type='client-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='client-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
