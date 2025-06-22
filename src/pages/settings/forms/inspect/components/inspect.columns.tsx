import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/badge/badge';
import { ButtonAction } from '@/components/common/button/column';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<IResponseResponse>[] = [
  {
    accessorKey: 'user',
    id: 'user',
    header: 'h_user',
    cell: (info) => {
      const { user } = info.row.original;
      return (
        <div className='flex items-center'>
          <Avatar name={user.name} src={user.image} size='sm' square />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>
              {user.name} {user.surname}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'structure',
    id: 'title',
    header: 'h_title',
    cell: (info) => {
      const { form } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-md' />
          <div className='flex flex-col ml-3 text-left'>
            <h5 className='font-bold text-left'>{form.title}</h5>
            <p className='w-full flex justify-start max-w-96 overflow-hidden text-ellipsis whitespace-nowrap'>
              {form.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'h_created',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'h_updated',
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'h_status',
    cell: (info) => {
      const { status } = info.row.original;
      return (
        <div className='flex justify-center items-center'>
          <Badge label={status} />
        </div>
      );
    },
  },
  {
    id: 'action',
    size: 30,
    header: 'h_action',
    cell: (info) => {
      const { id, status } = info.row.original;
      return (
        <div className='w-full flex justify-end '>
          {status === RESPONSE_STATUS.OPENED ? (
            <ButtonAction
              id={id}
              type='response'
              action={ROW_ACTIONS.RESPONSE}
              label={'continue'}
            />
          ) : (
            <ButtonAction id={id} type='response' action={ROW_ACTIONS.REPORT} />
          )}
          <div>
            {/*
            <ButtonAction
              id={id}
              type='response'
              icon='053'
              action={ROW_ACTIONS.DELETE}
              />
            */}
          </div>
        </div>
      );
    },
  },
];
