import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { FormattedDate } from '@/components/compose/forms';
import { TextEllipsis } from '@/components/common/text-ellipsis';

export const columns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'Nombre',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'Descripciòn',
    cell: (info) => {
      return <TextEllipsis text={String(info.getValue())} />;
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    size: 60,
    header: 'Creado en',
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='datetime' />;
    },
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
            data-type='place-update'
            data-action={ROW_ACTIONS.UPDATE}
          ></span>
          <span
            className='vox-icon vx-icon-053 p-1 size-sm cursor-pointer'
            data-id={id}
            data-type='place-delete'
            data-action={ROW_ACTIONS.DELETE}
          ></span>
        </div>
      );
    },
  },
];
