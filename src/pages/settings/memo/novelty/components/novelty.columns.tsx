import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { INovelty } from '../novelty';
import { Badge } from '@/components/common/badge/badge';

export const columns: ColumnDef<INovelty>[] = [
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
      const value = info.getValue() as string;
      return (
        <div className='max-w-[300px]'>
          <span className='block truncate' title={value}>
            {value}
          </span>
        </div>
      );
    },
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    size: 180,
    header: 'h_priority',
    cell: (info: any) => {
      const priority = info.getValue() as string;
      let status = 'info';
      
      if (priority === 'Alta') {
        status = 'error';
      } else if (priority === 'Media') {
        status = 'warning';
      }

      return (
        <Badge
          label={priority}
          status={status as 'info' | 'error' | 'warning' | 'success'}
          full
          outline
        />
      );
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
