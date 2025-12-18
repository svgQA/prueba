import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';
import { Chip } from '@/components/common/chip/chip';
import { FormattedDate } from '@/components/compose/forms';

export const columns: ColumnDef<any>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'h_name',
    enableGrouping: true,
    cell: (info) => {
      const name = info.getValue() as string;
      return <span>{name}</span>;
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'h_description',
    enableGrouping: true,
    cell: (info) => {
      const { description } = info.row.original;
      return <span>{description}</span>;
    },
  },
  {
    id: 'children',
    accessorKey: 'children',
    header: 'h_children',
    enableGrouping: true,
    cell: (info) => {
      const { children } = info.row.original;
      return <Chip label={children.length} width='xs' />;
    },
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'h_updated',
    enableGrouping: true,
    meta: { headerAlign: 'end', type: 'date' },
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='date' />;
    },
  },
  {
    id: 'actions',
    header: 'h_action',
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-end items-center'>
          <ButtonAction
            id={id}
            type='shift'
            action={ROW_ACTIONS.UPDATE}
            icon='123'
          />
          <ButtonAction
            id={id}
            type='shift'
            action={ROW_ACTIONS.DELETE}
            icon='053'
            color='!text-red-500'
          />
        </div>
      );
    },
  },
];
