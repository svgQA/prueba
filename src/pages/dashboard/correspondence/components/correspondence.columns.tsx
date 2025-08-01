// src/pages/dashboard/correspondence/components/correspondence.columns.tsx

import { ColumnDef } from '@tanstack/react-table';
import { ICorrespondence } from '../utils';
import { FormattedDate } from '@/components/compose/forms';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { DropdownActionsMenu, IDropdownAction } from '@/components/common/table/components/dropdown.actions.menu';

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
      size: 160,
      header: 'h_sender',
    },
    {
      id: 'notificar',
      //accessorKey: 'notificar',
      header: 'h_notification',
      size: 100,
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
      id: 'owner',
      accessorKey: 'owner',
      size: 180,
      header: 'h_owner',
      enableGrouping: true, // Podemos habilitar grouping por propietario
    },
    {
      id: 'receivedAt',
      accessorKey: 'receivedAt',
      size: 160,
      header: 'h_received',
      cell: (info) => {
        return (
          <FormattedDate date={info.getValue() as string} format='datetime' />
        );
      },
    },
    {
      id: 'houseNumber',
      accessorKey: 'houseNumber',
      size: 140,
      header: 'h_house_number',
      enableGrouping: true, // Podemos agrupar por ubicación
    },
    {
      id: 'status',
      accessorKey: 'status',
      size: 140,
      header: 'h_status',
      enableGrouping: true,
      cell: (info) => {
        const value = info.getValue() as string;
        return (
          <span
            className={`px-2 py-1 rounded ${value === 'Entregado'
                ? 'bg-secondary text-white'
                : 'bg-error text-white'
              }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      id: 'whoPickedUp',
      accessorKey: 'whoPickedUp',
      size: 180,
      header: 'h_who_picked_up',
    },
    {
      id: 'action',
      size: 20,
      header: 'h_action',
      cell: (info) => {
        const { id } = info.row.original;
        const actions: IDropdownAction[] = [
          {
            label: 'update',
            icon: 'vox-icon vx-icon-123 text-primary',
            onClick: () => {
              onClickAction({
                id: String(id),
                type: 'form',
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
