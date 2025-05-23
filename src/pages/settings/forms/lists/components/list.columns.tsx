import { ColumnDef } from '@tanstack/react-table';
import { IListResponse } from '@/types/form';
import { FormattedDate } from '@/components/compose/forms';

export const columns: ColumnDef<IListResponse>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Name',
    cell: (info) => info.getValue() || '-',
    size: 150,
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Fecha de creación',
    cell: (info) => (
      <FormattedDate date={String(info.getValue())} format='date' />
    ),
    size: 180,
  },
  {
    id: 'actions',
    size: 10,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='list'
            data-action='select'
          ></span>
        </div>
      );
    },
  },
];
