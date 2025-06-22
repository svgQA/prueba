import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';

export const getColumns = (
  onClickAction: (params: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => void
): ColumnDef<any>[] => [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'h_title',
    size: 180,
    cell: (info) => (
      <span
        className='font-medium cursor-pointer'
        onClick={() => info.row.toggleExpanded()}
      >
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: 'h_description',
    size: 300,
    cell: (info) => (
      <span
        className='line-clamp-2 max-w-[300px]'
        title={info.getValue() as string}
      >
        {info.getValue() as string}
      </span>
    ),
  },
  {
    id: 'data',
    accessorKey: 'data',
    header: 'h_data',
    size: 220,
    cell: (info) => {
      const value = info.getValue() as Record<string, any>;
      const parsed = `{formId: ${value?.formId ?? 'Ninguna'}, taskId: ${value?.taskId ?? 'Ninguna'}}`;
      return (
        <span className='whitespace-nowrap overflow-hidden text-ellipsis block'>
          {parsed}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: 'h_action',
    size: 20,
    cell: (info) => {
      const { id } = info.row.original;

      const actions: IDropdownAction[] = [
        {
          label: 'Editar plantilla',
          icon: 'vox-icon vx-icon-123 text-primary',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'shift',
              action: ROW_ACTIONS.UPDATE,
            });
          },
        },
        {
          label: 'Eliminar plantilla',
          icon: 'vox-icon vx-icon-053 text-red-500',
          color: 'text-red-600',
          onClick: () => {
            onClickAction({
              id: String(id),
              type: 'shift',
              action: ROW_ACTIONS.DELETE,
            });
          },
        },
      ];

      return (
        <div className='w-full flex justify-center'>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
