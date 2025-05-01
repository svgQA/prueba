// src/pages/dashboard/history/components/history.columns.ts

import { ColumnDef } from '@tanstack/react-table';
import { INotificationListItem } from '@/types/notification/INotificationTypes';
import dayjs from 'dayjs';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IDropdownAction, DropdownActionsMenu } from '@/components/common/table/components/dropdown.actions.menu';

export const getColumns = (
  onClickAction: (params: { id: string; type: string; action: ROW_ACTIONS }) => void
): ColumnDef<INotificationListItem>[] => [
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Título',
      size: 200,
      cell: (info) => (
        <span className="p-1 size-sm font-medium text-gray-800">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: 'Descripción',
      size: 250,
      cell: (info) => (
        <span
          className="line-clamp-2 max-w-[250px] text-sm text-gray-600"
          title={info.getValue() as string}
        >
          {info.getValue() as string}
        </span>
      ),
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Tipo',
      size: 120,
      cell: (info) => {
        const type = info.getValue() as string;
        const label = type === 'manual' ? 'Usuarios' : 'Programada';
        const color = type === 'manual' ? 'bg-m6 text-primary' : 'bg-caution text-yellow-800';

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
            {label}
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
        const date = new Date(info.getValue() as string);
        return (
          <time dateTime={date.toISOString()} className="p-1 size-sm text-gray-700">
            {dayjs(date).format('DD/MM/YYYY HH:mm')}
          </time>
        );
      },
    },
    {
      id: 'recipients',
      accessorKey: 'recipients',
      header: 'Destinatarios',
      size: 100,
      cell: (info) => (
        <div className="flex items-center gap-2 text-gray-700">
          <span className="vox-icon vx-icon-340 text-lg" />
          <span className="text-sm">{info.getValue() as number}</span>
        </div>
      ),
    },
    {
      id: 'openRate',
      accessorKey: 'openRate',
      header: 'Tasa de apertura',
      size: 150,
      cell: (info) => {
        const openRate = info.getValue() as number;

        let barColor = 'bg-caution';
        if (openRate >= 70) barColor = 'bg-m6';
        else if (openRate <= 30) barColor = 'bg-error';

        return (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${barColor}`}
                style={{ width: `${openRate}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {openRate}%
            </span>
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
            label: 'Editar usuario',
            icon: 'vox-icon vx-icon-123 text-primary',
            onClick: () => {
              onClickAction({ id: String(id), type: 'shift', action: ROW_ACTIONS.UPDATE });
            },
          },
          {
            label: 'Eliminar usuario',
            icon: 'vox-icon vx-icon-053 text-red-500',
            color: 'text-red-600',
            onClick: () => {
              onClickAction({ id: String(id), type: 'shift', action: ROW_ACTIONS.DELETE });
            },
          },
        ];

        return <DropdownActionsMenu actions={actions} />;
      },
    },
  ];
