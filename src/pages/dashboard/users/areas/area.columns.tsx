import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export const columns: ColumnDef<any>[] = [
  {
    id: 'description',
    accessorKey: 'description',
    size: 180,
    header: 'h_description',
    enableGrouping: true,
    cell: (info) => {
      const { description } = info.row.original;
      return <span>{description}</span>;
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: 'h_name',
    enableGrouping: true,
    cell: (info) => {
      const name = info.getValue() as string;
      return <span>{name}</span>;
    },
  },
  {
    id: 'actions',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id } = info.row.original;
      return (
        <div className='w-full flex justify-center'>
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
