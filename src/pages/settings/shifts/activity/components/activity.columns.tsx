import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IActivity } from '../activity';
import { FormattedDate } from '@/components/compose/forms';

export const columns: ColumnDef<IActivity>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },
  {
    id: 'start',
    accessorKey: 'start',
    size: 60,
    header: 'h_start',
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='datetime' />;
    },
  },
  {
    id: 'end',
    accessorKey: 'end',
    size: 60,
    header: 'h_end',
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='datetime' />;
    },
  },
  {
    id: 'serviceId',
    accessorKey: 'serviceId',
    size: 60,
    header: 'h_service',
  },
  {
    id: 'employeedId',
    accessorKey: 'employeedId',
    size: 60,
    header: 'h_employee',
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 60,
    header: 'h_status',
  },
  {
    id: 'type',
    accessorKey: 'type',
    size: 60,
    header: 'h_type',
  },
  {
    id: 'actions',
    size: 20,
    header: 'h_action',
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
