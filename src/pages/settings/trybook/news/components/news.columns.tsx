import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';
import { INews } from '@/types/trybook/news';
import { RelativeTime } from '@/components/common/relative/relative';
import { useUserStore } from '@/store/slices';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<INews>[] => {
  const { user } = useUserStore();

  return [
    {
      id: 'id',
      accessorKey: 'id',
      size: 60,
      header: 'h_id',
    },
    {
      id: 'name',
      accessorKey: 'name',
      size: 180,
      header: 'h_name',
      enableGrouping: true,
    },
    {
      id: 'description',
      accessorKey: 'description',
      size: 160,
      header: 'h_description',
      enableGrouping: true,
    },
    ...(user?.userType !== 'ADMIN_CLIENT'
      ? [
          {
            id: 'place',
            accessorKey: 'place.name',
            size: 120,
            header: 'h_place',
            enableGrouping: true,
            enableColumnFilter: user?.userType !== 'ADMIN_CLIENT',
          },
        ]
      : []),
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
};
