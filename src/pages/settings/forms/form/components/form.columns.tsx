import { IFormResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import { FloatBadge } from '@/components/common/badge/float';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';

export const columns: ColumnDef<IFormResponse>[] = [
  {
    accessorKey: 'title',
    id: 'title',
    header: 'Título',
    size: 180,
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
    size: 50,
    header: 'Fecha de creación',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    size: 50,
    header: 'Última actualización',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'category',
    id: 'category',
    size: 30,
    header: 'Categoría',
    cell: (info) => info.getValue() || '-',
  },
  {
    id: 'action',
    size: 20,
    cell: (info) => {
      const { id, report } = info.row.original;
      return (
        <div className='w-full flex justify-center items-center'>
          <span
            className='border text-primary border-b-light-dark dark:border-b-dark-light rounded px-2 py-1 text-sm cursor-pointer mr-2'
            data-id={id}
            data-type='form'
            data-action={ROW_ACTIONS.RESPONSE}
          >
            Start inspection
          </span>
          <span
            className='vox-icon vx-icon-123 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='form'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          {/*
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='form'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
          */}
          <FloatBadge label={report?.id ? '1' : undefined}>
            <span
              className='vox-icon vx-icon-143 p-1 size-sm cursor-pointer'
              data-id={id}
              data-type='form'
              data-action={ROW_ACTIONS.REPORT}
            ></span>
          </FloatBadge>
        </div>
      );
    },
  },
];
