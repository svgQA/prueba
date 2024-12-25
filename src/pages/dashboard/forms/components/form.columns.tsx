import { ColumnDef } from '@tanstack/react-table';
import { IResponseResponse } from '@/types/form';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';

export const columns: ColumnDef<IResponseResponse>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Fecha de creación',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Última actualización',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
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
