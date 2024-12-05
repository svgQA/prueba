import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';
import { IListResponse } from '@/types/form';

dayjs.extend(relativeTime);
dayjs.locale('es');

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
    cell: (info) => dayjs(info.getValue() as string).fromNow(),
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
