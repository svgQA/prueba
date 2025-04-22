import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';

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
        <div className='w-full flex justify-center group relative'>
          <span className='vox-icon vx-icon-233 p-1 size-sm cursor-pointer' />
          <div className='absolute left-full ml-2 hidden group-hover:flex bg-white shadow-lg rounded p-1'>
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
        </div>
      );
    },
  },
];
