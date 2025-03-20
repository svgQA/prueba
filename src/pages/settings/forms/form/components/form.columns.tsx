import { IFormResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import { FloatBadge } from '@/components/common/badge/float';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

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
            <div className='w-full flex justify-center max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
              {String(description)}
            </div>
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
          <ButtonAction
            id={id}
            type='form'
            action={ROW_ACTIONS.RESPONSE}
            label='Start inspection'
          />
          <ButtonAction
            id={id}
            type='form'
            action={ROW_ACTIONS.UPDATE}
            icon='123'
          />
          <FloatBadge label={report?.id ? '1' : undefined}>
            <ButtonAction
              id={id}
              type='form'
              action={ROW_ACTIONS.REPORT}
              icon='143'
            />
          </FloatBadge>
          <ButtonAction
            id={id}
            type='form'
            action={ROW_ACTIONS.DELETE}
            icon='053'
          />
        </div>
      );
    },
  },
];
