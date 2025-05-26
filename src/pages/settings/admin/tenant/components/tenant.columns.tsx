import { ColumnDef } from '@tanstack/react-table';
import { ITenantResponse } from '@/types/tenant';
import { FormattedDate } from '@/components/compose/forms';

export const columns: ColumnDef<ITenantResponse>[] = [
  {
    accessorKey: 'title',
    id: 'title',
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
    id: 'category',
    header: 'Categoría',
    cell: (info) => info.getValue() || '-',
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Fecha de creación',
    cell: (info) => (
      <FormattedDate date={String(info.getValue())} format='relative' />
    ),
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Última actualización',
    cell: (info) => (
      <FormattedDate date={String(info.getValue())} format='relative' />
    ),
  },
];
