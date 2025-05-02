import { IFormResponse } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import { FloatBadge } from '@/components/common/badge/float';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';
import i18next from 'i18next';
import { Avatar } from '@/components/common/Avatar';

const t = (key: string) => i18next.t(key);
export const columns: ColumnDef<IFormResponse>[] = [
  {
    accessorKey: 'title',
    id: 'title',
    header: t('forms.columns.title'),
    size: 80,
    cell: (info) => {
      const { title, description } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-md' />
          <div className='flex flex-col ml-3 text-left'>
            <h5 className='font-bold text-left'>{title}</h5>
            <p className='w-full flex justify-start max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
              {description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'group',
    id: 'group',
    size: 30,
    header: t('forms.columns.group'),
    cell: (info) => {
      const { group } = info.row.original as any;
      return (
        <div className='flex items-center'>
          <Avatar
            name={group?.name || 'group'}
            src={group?.image}
            size='sm'
            square
          />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>{group?.name || 'group'}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    size: 50,
    header: t('forms.columns.createdAt'),
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
