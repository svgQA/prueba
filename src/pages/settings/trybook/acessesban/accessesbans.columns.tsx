import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';
import { IAccessBan } from '@/types/trybook/access-ban';
import { RelativeTime } from '@/components/common/relative/relative';

export const getColumns = (
  onClickAction: (params: { id: string; action: ROW_ACTIONS }) => void
): ColumnDef<IAccessBan>[] => {
  return [
    { id: 'id', accessorKey: 'id', header: 'h_id', size: 70 },

    // Muestra user (si interno) o username (si externo)
    {
      id: 'subject',
      header: 'h_user',
      accessorFn: (row) => {
        if (row.user) {
          const full =
            `${row.user.name ?? ''}${row.user.surname ? ' ' + row.user.surname : ''}`.trim();
          return full || row.userId || '-';
        }
        return row.username ?? '-';
      },
      enableGrouping: true,
    },

    // cardId cuando sea externo (oculto si no hay)
    {
      id: 'cardId',
      header: 'cardId',
      accessorKey: 'cardId',
      cell: (info) => (info.getValue() ? String(info.getValue()) : '-'),
    },

    // Motivo
    {
      id: 'reason',
      accessorKey: 'reason',
      header: 'h_reason',
      enableGrouping: true,
      cell: (info) => (info.getValue() ? String(info.getValue()) : '-'),
    },

    // Tipo de ban (BAN / SPECIAL)
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Tipo',
      cell: (info) => {
        const type = String(info.getValue() ?? 'BAN');
        const color =
          type === 'BAN'
            ? 'text-red-600 bg-red-100 border border-red-200'
            : 'text-blue-600 bg-blue-100 border border-blue-200';
        const label = type === 'BAN' ? 'Ban' : 'Especial';
        return (
          <span className={`px-2 py-1 rounded-md text-sm font-medium ${color}`}>
            {label}
          </span>
        );
      },
    },

    // Expira
    {
      id: 'expiresAt',
      accessorKey: 'expiresAt',
      header: 'h_expires',
      cell: (info) =>
        info.getValue() ? (
          <RelativeTime date={info.getValue() as string} />
        ) : (
          '-'
        ),
    },

    // Estado
    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: 'h_status',
      cell: (info) => {
        const v = Boolean(info.getValue());
        return (
          <span className={v ? 'text-green-600' : 'text-gray-500'}>
            {v ? 'Activo' : 'Inactivo'}
          </span>
        );
      },
    },

    // Actualizado
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: 'h_updated',
      cell: (info) => <RelativeTime date={info.getValue() as string} />,
    },

    // Acciones
    {
      id: 'action',
      header: 'h_action',
      cell: (info) => {
        const { id } = info.row.original;
        const actions: IDropdownAction[] = [
          {
            label: 'update',
            icon: 'vox-icon vx-icon-123 text-primary',
            onClick: () =>
              onClickAction({ id: String(id), action: ROW_ACTIONS.UPDATE }),
          },
          {
            label: 'delete',
            icon: 'vox-icon vx-icon-053 text-red-500',
            color: 'text-red-600',
            onClick: () =>
              onClickAction({ id: String(id), action: ROW_ACTIONS.DELETE }),
          },
        ];
        return (
          <div className='w-full flex justify-end items-center'>
            <DropdownActionsMenu actions={actions} />
          </div>
        );
      },
    },
  ];
};
