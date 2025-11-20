import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { FormattedDate } from '@/components/compose/forms';
import { Badge } from '@/components/common/badge/badge';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<INotificationScheduledItem>[] => [
  {
    id: 'title',
    accessorKey: 'overrideTitle',
    header: 'h_title',
    size: 200,
    cell: (info) => <span>{info.getValue() as string}</span>,
  },
  {
    id: 'description',
    accessorKey: 'overrideDescription',
    header: 'h_description',
    size: 300,
    cell: (info) => (
      <span
        className='line-clamp-2 max-w-[300px]'
        title={info.getValue() as string}
      >
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'h_status',
    size: 140,
    cell: (info) => {
      const rowData = info.row.original;
      let status: 'h_created' | 'h_pending' | 'h_failed' | 'h_sent' =
        'h_created';

      if (rowData.status === 'pending') {
        status = 'h_pending';
      } else if (rowData.status === 'failed') {
        status = 'h_failed';
      } else if (rowData.status === 'sent') {
        status = 'h_sent';
      }

      return (
        <div className='w-full justify-center flex items-center'>
          <Badge label={String(status)} width='w-24' />
        </div>
      );
    },
  },
  {
    id: 'sendAt',
    accessorKey: 'sendAt',
    header: 'h_sent_date',
    size: 180,
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='datetime' />;
    },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'h_created',
    size: 180,
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='datetime' />;
    },
  },
  {
    id: 'actions',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id } = info.row.original;

      const actions: IDropdownAction[] = [
        {
          label: 'edit',
          icon: 'vox-icon vx-icon-123 text-primary',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'shift',
              action: ROW_ACTIONS.UPDATE,
            });
          },
        },
        {
          label: 'delete',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'shift',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return <DropdownActionsMenu actions={actions} />;
    },
  },
];
