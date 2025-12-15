import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { TaskCard } from '@/pages/settings/shifts/task/create/task.card';

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
    id: 'tasks',
    accessorKey: 'tasks',
    header: 'h_data',
    size: 300, // puedes ajustar este ancho
    cell: (info) => {
      const row = info.row.original as Record<string, any>;
      const tasks = row.tasks as any[];

      if (!Array.isArray(tasks) || tasks.length === 0) {
        return <span className='text-gray-400'>Sin tareas</span>;
      }

      return (
        <ul className='flex flex-row gap-3 overflow-x-auto vox-scroll-design pr-2 max-w-[500px]'>
          {tasks.map((item, index) => (
            <TaskCard key={index} task={item.task} remove={false} />
          ))}
        </ul>
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
          label: 'edit',
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
          label: 'delete',
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
