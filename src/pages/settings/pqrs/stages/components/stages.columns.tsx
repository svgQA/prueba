import { ColumnDef } from '@tanstack/react-table';

import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';

import { IStages, TypesOfStages } from '../utils/interface';
import { Badge } from '@/components/common/badge/badge';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<IStages>[] => {
  return [
    {
      id: 'id',
      accessorKey: 'id',
      size: 60,
      header: 'h_id',
    },
    {
      id: 'stageName',
      accessorKey: 'stageName',
      size: 180,
      header: 'h_stage_name',
      enableGrouping: true,
    },
    {
      id: 'goal',
      accessorKey: 'goal',
      size: 200,
      header: 'h_goal',
      enableGrouping: true,
    },
    // {
    //   id: 'executionNotes',
    //   accessorKey: 'executionNotes',
    //   size: 160,
    //   header: 'h_execution_notes',
    // },
    {
      id: 'status',
      accessorKey: 'status',
      size: 100,
      header: 'h_status',
      enableGrouping: true,
    },
    {
      id: 'type',
      accessorKey: 'type',
      size: 100,
      header: 'h_type',
      enableGrouping: true,
      cell: (info) => {
        const type = info.getValue();
        return (
          <Badge
            label={type === TypesOfStages.CONTINUE ? 'h_automatic' : 'h_manual'}
          />
        );
      },
    },
    {
      id: 'area',
      accessorKey: 'areaId',
      size: 100,
      header: 'h_area',
      enableGrouping: true,
      cell: (info) => {
        const areaId = info.getValue();
        return <Badge label={areaId ? 'yes' : 'no'} />;
      },
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
          <div className='w-full flex justify-end items-center'>
            <DropdownActionsMenu actions={actions} />
          </div>
        );
      },
    },
  ];
};
