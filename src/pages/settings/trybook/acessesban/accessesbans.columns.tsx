// pages/trybook/access-bans/components/access-bans.columns.tsx
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

    {
      id: 'user',
      header: 'h_user',
      accessorFn: (row) =>
        row.user
          ? `${row.user.name}${row.user.surname ? ' ' + row.user.surname : ''}`
          : row.userId ?? '-',
      size: 220,
      enableGrouping: true,
    },

    {
      id: 'reason',
      accessorKey: 'reason',
      header: 'h_reason',
      size: 220,
      enableGrouping: true,
    },

    {
      id: 'expiresAt',
      accessorKey: 'expiresAt',
      header: 'h_expires',
      size: 160,
      cell: (info) =>
        info.getValue()
          ? <RelativeTime date={info.getValue() as string} />
          : '-',
    },

    {
      id: 'isActive',
      accessorKey: 'isActive',
      header: 'h_status',
      size: 100,
      cell: (info) => {
        const v = info.getValue() as boolean;
        return (
          <span className={v ? 'text-green-600' : 'text-gray-500'}>
            {v ? 'Activo' : 'Inactivo'}
          </span>
        );
      },
    },

    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: 'h_updated',
      size: 160,
      cell: (info) => <RelativeTime date={info.getValue() as string} />,
    },

    {
      id: 'action',
      header: 'h_action',
      size: 60,
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
          <div className='w-full flex justify-center items-center'>
            <DropdownActionsMenu actions={actions} />
          </div>
        );
      },
    },
  ];
};
