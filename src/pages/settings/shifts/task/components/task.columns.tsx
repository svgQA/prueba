import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { ITask } from '../task';
import { TextEllipsis } from '@/components/common/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';

export const columns: ColumnDef<ITask>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    size: 60,
    header: 'h_id',
  },

  {
    id: 'name',
    accessorKey: 'name',
    size: 60,
    header: 'h_name',
  },
  {
    id: 'description',
    accessorKey: 'description',
    size: 60,
    header: 'h_description',
    cell: (info) => {
      const description = info.getValue() as string;
      return <TextEllipsis text={description} maxWidth='300px' />;
    },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'h_type',
  },
  {
    id: 'hourStart',
    accessorKey: 'hourStart',
    size: 60,
    header: 'h_hour_start',
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='time' />;
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
