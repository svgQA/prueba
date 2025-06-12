import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/button/button';
import { Chip } from '@/components/common/chip/chip';
import { RelativeTime } from '@/components/common/relative/relative';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import i18n from '@/i18n';
import { IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IResponseResponse>[] => [
  {
    accessorKey: 'user',
    id: 'user',
    header: i18n.t('form.columns.user'),
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const { user } = info.row.original;
      return (
        <div className='flex items-center'>
          <Avatar name={user?.name} src={user?.image} size='sm' square />
          <div className='flex flex-col ml-3'>
            <div className='font-bold'>
              {user?.name} {user?.surname}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    id: 'title',
    header: i18n.t('form.columns.title'),
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const { form } = info.row.original;
      return (
        <div className='flex items-center'>
          <span className='vox-icon vx-icon-152 mt-1 size-md' />
          <div className='flex flex-col ml-3 text-left'>
            <h5 className='font-bold text-left'>{form.title}</h5>
            <TextEllipsis text={form.description} maxWidth='300px' />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: i18n.t('form.columns.createdAt'),
    meta: { headerAlign: 'center' },
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: i18n.t('form.columns.updatedAt'),
    meta: { headerAlign: 'center' },
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: i18n.t('form.columns.status'),
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const { status } = info.row.original;
      return <Chip label={status} />;
    },
  },
  {
    id: 'action',
    meta: { headerAlign: 'center' },
    size: 30,
    cell: (info) => {
      const { id, status } = info.row.original;

      const actions: IDropdownAction[] = [
        status === RESPONSE_STATUS.OPENED
          ? {
              label: i18n.t('form.inspect.continue'),
              icon: 'vox-icon vx-icon-030 text-primary',
              onClick: () => {
                onClickAction({
                  id: String(id),
                  type: 'response',
                  action: ROW_ACTIONS.RESPONSE,
                });
              },
            }
          : {
              label: i18n.t('form.inspect.report'),
              icon: 'vox-icon vx-icon-433 text-primary',
              onClick: () => {
                onClickAction({
                  id: String(id),
                  type: 'response',
                  action: ROW_ACTIONS.REPORT,
                });
              },
            },
        {
          label: i18n.t('form.inspect.delete'),
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'response',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return (
        <div className='w-full flex justify-end gap-3 items-center'>
          {status === RESPONSE_STATUS.OPENED && (
            <Button
              name='continue'
              label={i18n.t('form.inspect.continue')}
              icon='030'
              unpadded
              onClick={() => {
                onClickAction({
                  id: String(id),
                  type: 'response',
                  action: ROW_ACTIONS.RESPONSE,
                });
              }}
            ></Button>
          )}
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
