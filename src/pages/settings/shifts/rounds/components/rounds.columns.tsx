import { ROW_ACTIONS } from '@/components/common/table/enum';
import { Round } from '../utils/rounds';
import { ColumnDef } from '@tanstack/react-table';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { Badge } from '@/components/common/badge/badge';

export const columns: ColumnDef<Round>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Nombre',
    enableGrouping: true,
    cell: (info) => {
      const { name } = info.row.original;
      return <TextEllipsis text={name} maxWidth='250px' />;
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Descripción',
    enableGrouping: true,
    cell: (info) => {
      const { description } = info.row.original;
      return <TextEllipsis text={description} maxWidth='250px' />;
    },
  },
  {
    id: 'frequency',
    accessorKey: 'frequency',
    header: 'Frecuencia',
    enableGrouping: true,
    cell: (info) => {
      const { frequency } = info.row.original;
      return <Badge label={String(frequency)} />;
    },
  },
  {
    id: 'radius',
    accessorKey: 'radius',
    header: 'Radio',
    enableGrouping: true,
    cell: (info) => {
      const { radius } = info.row.original;
      return <Badge label={String(radius)} />;
    },
  },
  {
    id: 'actions',
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
