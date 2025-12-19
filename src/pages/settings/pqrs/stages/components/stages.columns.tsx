import { ColumnDef } from '@tanstack/react-table';

import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  DropdownActionsMenu,
  IDropdownAction,
} from '@/components/common/table/components/dropdown.actions.menu';

import { IStages, TypesOfStages } from '../utils/interface';
import { Badge } from '@/components/common/badge/badge';
import { TextEllipsis } from '@/components/common/text-ellipsis';

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
      header: 'h_id',
    },
    {
      id: 'stageName',
      accessorKey: 'stageName',
      header: 'h_stage_name',
      enableGrouping: true,
      cell: (info) => (
        <TextEllipsis text={String(info.getValue())} maxWidth='200px' />
      ),
    },
    {
      id: 'goal',
      accessorKey: 'goal',
      header: 'h_goal',
      enableGrouping: true,
      cell: (info) => (
        <TextEllipsis text={String(info.getValue())} maxWidth='200px' />
      ),
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
      header: 'h_status',
      enableGrouping: true,
    },
    {
      id: 'type',
      accessorKey: 'type',
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
