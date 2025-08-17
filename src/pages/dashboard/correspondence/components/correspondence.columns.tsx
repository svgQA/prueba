// src/pages/dashboard/correspondence/components/correspondence.columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { FormattedDate } from '@/components/compose/forms';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';
import { ICorrespondence } from '@/types/access';
import { Badge } from '@/components/common/badge/badge';
import { RelativeTime } from '@/components/common/relative/relative';

/**
 * Columnas para la tabla de Correspondencia.
 * Son similares a las de Access, con la posibilidad de grouping
 * y la funcionalidad de filtrado/paginación que provee la tabla principal.
 */
export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<ICorrespondence>[] => [
  {
    id: 'sender',
    accessorKey: 'sender',
    size: 120,
    header: 'h_sender',
  },
  {
    id: 'owner',
    accessorKey: 'owner',
    size: 120,
    header: 'h_owner',
    enableGrouping: true, // Podemos habilitar grouping por propietario
  },
  {
    id: 'houseNumber',
    accessorKey: 'houseNumber',
    size: 120,
    header: 'h_house_number',
    enableGrouping: true, // Podemos agrupar por ubicación
  },
  {
    id: 'whoPickedUp',
    accessorKey: 'whoPickedUp',
    size: 120,
    header: 'h_who_picked_up',
  },
  {
    id: 'packageType',
    accessorKey: 'packageType',
    size: 120,
    header: 'h_package_type',
    enableGrouping: true,
  },
  {
    id: 'observation',
    accessorKey: 'observation',
    size: 200,
    header: 'h_observation',
    cell: (info) => {
      const observation = info.getValue() as string;
      return observation ? (
        <span className='truncate max-w-[180px] block' title={observation}>
          {observation}
        </span>
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: 'messageToOwner',
    accessorKey: 'messageToOwner',
    size: 200,
    header: 'h_message_to_owner',
    cell: (info) => {
      const message = info.getValue() as string;
      return message ? (
        <span className='truncate max-w-[180px] block' title={message}>
          {message}
        </span>
      ) : (
        <span className='text-gray-400'>-</span>
      );
    },
  },
  {
    id: 'notificar',
    //accessorKey: 'notificar',
    header: 'h_notification',
    size: 120,
    cell: (info) => {
      return (
        <span
          className='vox-icon vx-icon-155 p-1 size-sm cursor-pointer'
          onClick={() => info.row.toggleExpanded()}
        />
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    size: 120,
    header: 'h_status',
    enableGrouping: true,
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const status = info.getValue() as string;
      let color = 'info';

      if (status === 'DELIVERED') {
        color = 'error';
      } else if (status === 'RECEIVED') {
        color = 'warning';
      }

      return (
        <Badge
          label={status}
          status={color as 'info' | 'error' | 'warning' | 'success'}
          full
          outline
        />
      );
    },
  },
  {
    id: 'receivedAt',
    accessorKey: 'receivedAt',
    size: 120,
    header: 'h_received',
    cell: (info) => {
      return (
        <FormattedDate date={info.getValue() as string} format='datetime' />
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'h_updated',
    meta: { headerAlign: 'end' },
    cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    id: 'action',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { id } = info.row.original;
      const actions: IDropdownAction[] = [
        // {
        //   label: 'update',
        //   icon: 'vox-icon vx-icon-123 text-primary',
        //   onClick: () => {
        //     onClickAction({
        //       id: String(id),
        //       type: 'form',
        //       action: ROW_ACTIONS.UPDATE,
        //     });
        //   },
        // },
        {
          label: 'delete',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'form',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return (
        <div className='w-full flex justify-center items-center'>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
