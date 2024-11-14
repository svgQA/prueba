import { IForm } from '../utils/form';
import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

export const columns: ColumnDef<IForm>[] = [
  {
    accessorKey: 'title',
    header: 'Título',
    cell: (info) => {
      const { title, description } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-xl' />
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
    header: 'Categoría',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha de creación',
    cell: (info) => dayjs(info.getValue() as string).fromNow(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Última actualización',
    cell: (info) => dayjs(info.getValue() as string).fromNow(),
  },
];
