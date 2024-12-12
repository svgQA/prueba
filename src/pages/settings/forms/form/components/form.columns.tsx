import { IFormResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/interface';
import { RelativeTime } from '@/components/common';

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
    accessorKey: 'category',
    id: 'category',
    header: 'Categoría',
    cell: (info) => info.getValue() || '-',
  },
  {
    id: 'action',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='form'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='form'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
          <span
            className='vox-icon vx-icon-143 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='form'
            data-action={ROW_ACTIONS.REPORT}
          ></span>
        </div>
      );
    },
  },
];
