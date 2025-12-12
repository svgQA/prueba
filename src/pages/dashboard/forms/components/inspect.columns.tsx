import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/badge/badge';
import { Button } from '@/components/common/button/button';
import { RelativeTime } from '@/components/common/relative/relative';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { IResponseResponse, RESPONSE_STATUS } from '@/types/form';
import { ColumnDef } from '@tanstack/react-table';

export const getColumns = (t: any,
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IResponseResponse>[] => [
  {
    accessorKey: 'user',
    id: 'user',
    header: 'h_user',
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const { user } = info.row.original;
      const name = `${user?.name} ${user?.surname}`;
      return (
        <div className='flex items-center gap-2'>
          <Avatar name={user?.name} src={user?.image} size='sm' square />
          <TextEllipsis text={name} maxWidth='250px' />
        </div>
      );
    },
  },
  {
    id: 'service',
    accessorKey: 'extraData.serviceName',
    size: 180,
    header: 'h_service',
    enableGrouping: true,
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const service = String(info.getValue());
      return <TextEllipsis text={service} maxWidth='250px' />;
    },
  },
  {
    id: 'contract',
    accessorKey: 'extraData.contractName',
    size: 120,
    header: 'h_contract',
    enableGrouping: true,
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const contract = String(info.getValue());
      return <TextEllipsis text={contract} maxWidth='250px' />;
    },
  },
  {
    id: 'client',
    accessorKey: 'extraData.clientName',
    size: 120,
    header: 'h_client',
    enableGrouping: true,
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const client = String(info.getValue());
      return <TextEllipsis text={client} maxWidth='250px' />;
    },
  },
  {
    accessorKey: 'title',
    id: 'title',
    header: 'h_title',
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const { form } = info.row.original;
      return (
        <div className='flex items-center'>
          <div className='flex flex-col ml-3 text-left'>
            <TextEllipsis
              text={form.title}
              maxWidth='800px'
              className='text-xl font-bold'
            />
            <TextEllipsis text={form.description} maxWidth='300px' />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'h_created',
    meta: { headerAlign: 'center' },
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'h_updated',
    meta: { headerAlign: 'center' },
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'h_status',
    meta: { headerAlign: 'center' },
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
    meta: { headerAlign: 'center' },
    size: 30,
    header: 'h_action',
    cell: (info) => {
      const { id, status } = info.row.original;

      const actions: IDropdownAction[] = [
        status === RESPONSE_STATUS.OPENED
          ? {
              label: 'continue',
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
              label: t('actions.report'),
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
          label: t('actions.delete'),
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
              label='continue'
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
