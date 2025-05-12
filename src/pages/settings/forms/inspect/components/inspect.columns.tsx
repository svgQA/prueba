import { Avatar } from '@/components/common/Avatar';
import { ButtonAction } from '@/components/common/button/column';
import { Chip } from '@/components/common/chip/chip';
import { RelativeTime } from '@/components/common/relative/relative';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';
import i18n from '@/i18n';

export const columns: ColumnDef<IResponseResponse>[] = [
  {
    accessorKey: 'user',
    id: 'user',
    header: i18n.t('forms.columns.user'),
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
    header: i18n.t('forms.columns.title'),
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
    header: i18n.t('forms.columns.createdAt'),
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: i18n.t('forms.columns.updatedAt'),
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: i18n.t('forms.columns.status'),
    cell: (info) => {
      const { status } = info.row.original;
      return <Chip label={status} />;
    },
  },
  {
    id: 'action',
    size: 30,
    cell: (info) => {
      const { id, status } = info.row.original;
      return (
        <div className='w-full flex justify-end '>
          {status === RESPONSE_STATUS.OPENED ? (
            <ButtonAction
              id={id}
              type='response'
              action={ROW_ACTIONS.RESPONSE}
              label={i18n.t('forms.buttons.continue')}
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
