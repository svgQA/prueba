import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { FormattedDate } from '@/components/compose/forms';

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
      const value = info.getValue() as string;
      let colorClass = 'bg-gray-border text-gray-text-dark';

      if (value === 'sent')
        colorClass = 'bg-secondary text-white'; // Enviada -> Verde
      else if (value === 'pending')
        colorClass = 'bg-primary text-white'; // Pendiente -> Azul
      else if (value === 'failed') colorClass = 'bg-error text-white'; // Fallida -> Rojo

      return (
        <div
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </div>
      );
    },
  },
  {
    id: 'sendAt',
    accessorKey: 'sendAt',
    header: 'h_send_date',
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
