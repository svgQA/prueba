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
// import { RelativeTime } from '@/components/common/relative/relative';
import { TextEllipsis } from '@/components/common/text-ellipsis/text-ellipsis';

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
    id: 'service',
    accessorKey: 'serviceName',
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
    accessorKey: 'contractName',
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
    accessorKey: 'clientName',
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
    id: 'owner',
    accessorKey: 'residence.user.name',
    size: 120,
    header: 'h_owner',
    enableGrouping: true,
    cell: (info) => {
      const row = info.row.original;
      const fullName =
        `${row.residence?.user?.name || ''} ${row.residence?.user?.surname || ''}`.trim();
      return fullName || '-';
    },
  },
  {
    id: 'houseNumber',
    accessorKey: 'residence.houseNumber',
    // size: 200,
    header: 'h_house_number',
    enableGrouping: true,
    cell: (info) => {
      const row = info.row.original;
      const location = [
        row.residence?.houseNumber,
        row.residence?.block && `Bloque ${row.residence.block}`,
        row.residence?.floor !== undefined &&
          row.residence?.floor !== null &&
          `Piso ${row.residence.floor}`,
      ]
        .filter(Boolean)
        .join(' - ');

      return location || '-';
    },
  },
  {
    id: 'place',
    accessorKey: 'residence.place.name',
    // size: 120,
    header: 'h_place',
    enableGrouping: true,
    cell: (info) => {
      const row = info.row.original;
      return row.residence?.place?.name || '-';
    },
  },
  {
    id: 'whoPickedUp',
    accessorKey: 'whoPickedUp',
    // size: 120,
    header: 'h_who_picked_up',
  },
  {
    id: 'packageType',
    accessorKey: 'packageType',
    // size: 120,
    header: 'h_package_type',
    enableGrouping: true,
  },
  {
    id: 'observation',
    accessorKey: 'observation',
    // size: 200,
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
    // size: 200,
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
  // {
  //   id: 'notificar',
  //   header: 'h_notification',
  //   size: 120,
  //   cell: (info) => {
  //     return (
  //       <span
  //         className='vox-icon vx-icon-155 p-1 size-sm cursor-pointer'
  //         onClick={() => info.row.toggleExpanded()}
  //       />
  //     );
  //   },
  // },
  {
    id: 'status',
    accessorKey: 'status',
    // size: 120,
    header: 'h_status',
    enableGrouping: true,
    meta: { headerAlign: 'center' },
    cell: (info) => {
      const status = info.getValue() as string;
      let color = 'info';

      if (status === 'DELIVERED') {
        color = 'success';
      } else if (status === 'RECEIVED') {
        color = 'warning';
      } else if (status === 'NOTIFIED') {
        color = 'info';
      } else if (status === 'IN_RECEPTION') {
        color = 'error';
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
    // size: 120,
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
    cell: (info) => (
      <FormattedDate date={info.getValue() as string} format='date' />
    ),
    // cell: (info) => <RelativeTime date={info.getValue() as string} />,
  },
  {
    id: 'action',
    size: 20,
    header: 'h_action',
    cell: (info) => {
      const { uuid } = info.row.original;
      const actions: IDropdownAction[] = [
        // {
        //   label: 'update',
        //   icon: 'vox-icon vx-icon-123 text-primary',
        //   onClick: () => {
        //     onClickAction({
        //       id: String(uuid),
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
              id: String(uuid),
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
