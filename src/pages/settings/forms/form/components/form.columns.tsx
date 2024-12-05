import { IFormResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const columns: ColumnDef<IFormResponse>[] = [
  {
    accessorKey: 'title',
    id: 'title',
    header: 'Título',
    cell: (info) => {
      const { title, description } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-sm' />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>{String(title)}</div>
            <div className='text-sm text-gray-500'>{String(description)}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: 'Categoría',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Fecha de creación',
    cell: (info) => dayjs(info.getValue() as string).fromNow(),
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Última actualización',
    cell: (info) => dayjs(info.getValue() as string).fromNow(),
  },
  {
    accessorKey: 'Action',
    id: 'action',
    header: 'Action',
    size: 10,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='form'
            data-action='update'
          ></span>
        </div>
      );
    },
  },
];
