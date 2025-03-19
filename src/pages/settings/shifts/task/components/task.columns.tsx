import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ITask } from '../task';
import { Badge } from '@/components/common/badge/badge';

export const columns: ColumnDef<ITask>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'ID',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'Descripción',
    cell: (info) => {
      const description = info.getValue() as string;
      return (
        <div className='w-full flex justify-center max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
          {description}
        </div>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 60,
    header: 'Estado',
    cell: (info) => (
      <div className='flex flex-row justify-center'>
        <Badge label={String(info.getValue())} icon='123' outlined />
      </div>
    ),
  },
  {
    id: 'start',
    accessorKey: 'start',
    size: 60,
    header: 'Fecha',
  },
  {
    id: 'formId',
    accessorKey: 'formId',
    size: 60,
    header: 'Formulario',
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
