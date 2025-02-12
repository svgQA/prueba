import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ISchedule } from '../schedule';
import dayjs from 'dayjs';

export const columns: ColumnDef<ISchedule>[] = [
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
    id: 'hourStart',
    accessorKey: 'hourStart',
    size: 60,
    header: 'Hora inicio',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('HH:mm');
    },
  },
  {
    id: 'hourEnd',
    accessorKey: 'hourEnd',
    size: 180,
    header: 'Hora fin',
    cell: (info) => {
      const dateStr = info.getValue() as string;
      return dayjs(dateStr).format('HH:mm');
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
