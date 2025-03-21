import { useEffect, useRef } from 'preact/hooks';
import { ComponentType } from 'preact';
import { BarTask } from '../../types/bar-task';
import { GeneralTask, Task } from '../../types/public-types';

export type TaskListHeaderProps = {
  headerHeight: number;
  rowWidth: string | number;
  fontFamily: string;
  fontSize: string | number;
};

export type TaskListTableProps = {
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: GeneralTask;
  selectedTaskId: string;
  onUserClick?: (userId: string | number) => void;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
};

export type TaskListProps = {
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  rowHeight: number;
  ganttHeight: number;
  scrollY: number;
  locale: string;
  tasks: GeneralTask;
  taskListRef: { current: HTMLDivElement | null };
  horizontalContainerClass?: string;
  selectedTask: BarTask | undefined;
  setSelectedTask: (task: string) => void;
  onExpanderClick: (task: Task) => void;
  onUserClick: (user: string | number) => void;
  TaskListHeader: ComponentType<TaskListHeaderProps>;
  TaskListTable: ComponentType<TaskListTableProps>;
};

export function TaskList({
  headerHeight,
  fontFamily,
  fontSize,
  rowWidth,
  rowHeight,
  scrollY,
  tasks,
  selectedTask,
  setSelectedTask,
  onExpanderClick,
  locale,
  // ganttHeight,
  taskListRef,
  // horizontalContainerClass,
  TaskListHeader,
  TaskListTable,
  onUserClick,
}: TaskListProps) {
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  const headerProps: TaskListHeaderProps = {
    headerHeight,
    fontFamily,
    fontSize,
    rowWidth,
  };

  const selectedTaskId = selectedTask ? String(selectedTask.id) : '';
  const tableProps = {
    rowHeight,
    rowWidth,
    fontFamily,
    fontSize,
    tasks,
    locale,
    selectedTaskId: selectedTaskId,
    setSelectedTask,
    onExpanderClick,
    onUserClick,
  };

  return (
    <div
      ref={taskListRef}
      className='border-r-2 border-gray-100 dark:border-b-dark-light'
    >
      <TaskListHeader {...headerProps} />
      <div
        ref={horizontalContainerRef}
        // className={horizontalContainerClass}
        // className='bg-red-400'
        // style={ganttHeight ? { height: ganttHeight } : {}}
      >
        <TaskListTable {...tableProps} />
      </div>
    </div>
  );
}
