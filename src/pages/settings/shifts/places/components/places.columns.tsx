import { ColumnDef } from '@tanstack/react-table';
import { Place } from '../utils/places';
import { ROW_ACTIONS } from '@/components/common/table/enum';

export const columns: ColumnDef<Place>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,

    header: 'ID',
  },
  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'Nombre',
  },
  {
    id: 'code',
    accessorKey: 'code',
    size: 60,
    header: 'Descripción',
  },
  {
    id: 'latitude',
    accessorKey: 'latitude',
    size: 60,
    header: 'Latitud',
  },
  {
    id: 'longitude',
    accessorKey: 'longitude',
    size: 60,
    header: 'Longitud',
  },
  {
    id: 'address',
    accessorKey: 'address',
    size: 180,
    header: 'Dirección',
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
