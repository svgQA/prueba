import { ColumnDef } from '@tanstack/react-table';
import { INotificationListItem } from '@/types/notification/INotificationTypes';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';
import { FormattedDate } from '@/components/compose/forms';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<INotificationListItem>[] => [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Título',
    size: 200,
    cell: (info) => (
      <TextEllipsis text={String(info.getValue())} maxWidth='200px' />
    ),
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Descripción',
    size: 250,
    cell: (info) => (
      <TextEllipsis text={String(info.getValue())} maxWidth='250px' />
    ),
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Tipo',
    size: 120,
    cell: (info) => {
      const type = String(info.getValue());
      const color =
        type === 'Usuarios'
          ? 'bg-m6 text-primary'
          : 'bg-caution text-yellow-800';

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}
        >
          {type}
        </span>
      );
    },
  },
  {
    id: 'sentAt',
    accessorKey: 'sentAt',
    header: 'Fecha de envío',
    size: 180,
    cell: (info) => {
      return <FormattedDate date={String(info.getValue())} format='datetime' />;
    },
  },
  {
    id: 'recipients',
    accessorKey: 'recipients',
    header: 'Destinatarios',
    size: 100,
    cell: (info) => (
      <div className='flex items-center gap-2'>
        <span className='vox-icon vx-icon-340 text-lg' />
        <span className='text-sm'>{Number(info.getValue())}</span>
      </div>
    ),
  },
  {
    id: 'openRate',
    accessorKey: 'openRate',
    header: 'Tasa de apertura',
    size: 150,
    cell: (info) => {
      const openRate = Number(info.getValue());

      let barColor = 'bg-caution';
      if (openRate >= 70) barColor = 'bg-m6';
      else if (openRate <= 30) barColor = 'bg-error';

      return (
        <div className='flex items-center gap-2 w-full'>
          <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className={`h-full ${barColor}`}
              style={{ width: `${openRate}%` }}
            />
          </div>
          <span className='text-xs font-semibold'>{openRate}%</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;

      const actions: IDropdownAction[] = [
        {
          label: 'Reprogramar notificación',
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
          label: 'Eliminar notificación',
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
