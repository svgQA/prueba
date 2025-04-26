import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ButtonAction } from '@/components/common/button/column';

export const columns: ColumnDef<any>[] = [
  {
    id: 'description',
    accessorKey: 'description',
    size: 180,
    header: 'Descripción',
    enableGrouping: true,
    cell: (info) => {
      const { description } = info.row.original;
      return (
        <span
          className='p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {description}
        </span>
      );
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 180,
    header: 'Nombre',
    enableGrouping: true,
    meta: { expander: 'serviceId' },

    cell: (info) => {
      const name = info.getValue() as string;
      return (
        <span
          className=' p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        >
          {name}
        </span>
      );
    },
  },
  {
    id: 'actions',
    size: 20,
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
