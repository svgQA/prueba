// src/pages/dashboard/access/components/access.columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { IAccess } from '../utils';
import { FormattedDate } from '@/components/compose/forms';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IAccess>[] => [
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
    size: 180,
    header: 'h_description',
    enableGrouping: true,
  },
  {
    id: 'phone',
    accessorKey: 'user.phone',
    size: 140,
    header: 'h_phone',
  },
  {
    id: 'checkIn',
    accessorKey: 'checkIn',
    size: 140,
    header: 'h_check_in',
    cell: (info) => {
      return <FormattedDate date={info.getValue() as string} format='time' />;
    },
  },
  {
    id: 'checkOut',
    accessorKey: 'checkOut',
    size: 140,
    header: 'h_check_out',
    cell: (info) => {
      return <FormattedDate date={info.getValue() as string} format='time' />;
    },
  },
  {
    id: 'houseNumber',
    accessorKey: 'user.houseNumber',
    size: 140,
    header: 'h_house_number',
    enableGrouping: true,
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
