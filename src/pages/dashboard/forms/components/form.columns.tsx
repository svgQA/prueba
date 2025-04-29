import { ColumnDef } from '@tanstack/react-table';
import { IResponseResponse } from '@/types/form';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import i18next from 'i18next';

// Función para obtener traducciones
const t = (key: string) => i18next.t(key);

export const columns: ColumnDef<IResponseResponse>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: t('forms.columns.id'),
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('forms.columns.createdAt'),
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: t('forms.columns.updatedAt'),
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
