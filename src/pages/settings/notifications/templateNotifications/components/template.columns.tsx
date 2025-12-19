import { ColumnDef } from '@tanstack/react-table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import {
  IDropdownAction,
  DropdownActionsMenu,
} from '@/components/common/table/components/dropdown.actions.menu';
import { TaskCard } from '@/pages/settings/shifts/task/create/task.card';
import { TextEllipsis } from '@/components/common/text-ellipsis';

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
    cell: (info) => (
      <TextEllipsis text={String(info.getValue())} maxWidth='200px' />
    ),
  },
  {
    id: 'tasks',
    accessorKey: 'tasks',
    header: 'h_data',
    cell: (info) => {
      const row = info.row.original as Record<string, any>;
      const tasks = row.tasks as any[];

      if (!Array.isArray(tasks) || tasks.length === 0) {
        return <span className='text-gray-400'>Sin tareas</span>;
      }

      return (
        <ul className='flex flex-row gap-x-1 overflow-x-auto vox-scroll-design max-w-[500px] py-1 items-center'>
          {tasks.map((item, index) => {
            if (index > 1 && index < 3) return <p>More...</p>;
            if (index > 1) return null;
            return <TaskCard key={index} task={item.task} remove={false} />;
          })}
        </ul>
      );
    },
  },
  {
    id: 'actions',
    header: 'h_action',
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
        <div className='w-full flex justify-end items-center'>
          <DropdownActionsMenu actions={actions} />
        </div>
      );
    },
  },
];
