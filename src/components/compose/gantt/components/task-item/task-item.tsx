import { useEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { VNode } from 'preact';
import { BarTask } from '../../types/bar-task';
import { GanttContentMoveAction } from '../../types/gantt-task-actions';
import { Bar } from './bar/bar';
// import { BarSmall } from './bar/bar-small';
// import { Milestone } from './milestone/milestone';
// import { Project } from './project/project';
// import style from './task-list.module.css';

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: KeyboardEvent | MouseEvent
  ) => any;
};

export const TaskItem = (props: TaskItemProps) => {
  const {
    // arrowIndent,
    // taskHeight,
    // rtl,
    task,
    isDelete,
    isSelected,
    onEventStart,
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const taskItem = useSignal<VNode>(<div />);
  const isTextInside = useSignal<boolean>(true);

  useEffect(() => {
    switch (task.typeInternal) {
      /*
      case 'milestone':
        taskItem.value = <Milestone {...props} />;
        break;
      case 'project':
        taskItem.value = <Project {...props} />;
        break;
      case 'smalltask':
        taskItem.value = <BarSmall {...props} />;
        break;
    */
      default:
        taskItem.value = <Bar {...props} />;
        break;
    }
  }, [task, isSelected]);

  useEffect(() => {
    if (textRef.current) {
      isTextInside.value = textRef.current.getBBox().width < task.x2 - task.x1;
    }
  }, [textRef, task]);

  /*
  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside.value) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };
  */

  return (
    <g
      onKeyDown={(e: KeyboardEvent) => {
        switch (e.key) {
          case 'Delete': {
            if (isDelete) onEventStart('delete', task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={(e: MouseEvent) => {
        onEventStart('mouseenter', task, e);
      }}
      onMouseLeave={(e: MouseEvent) => {
        onEventStart('mouseleave', task, e);
      }}
      onDblClick={(e: MouseEvent) => {
        onEventStart('dblclick', task, e);
      }}
      onClick={(e: MouseEvent) => {
        onEventStart('click', task, e);
      }}
      // onContextMenu={(e: MouseEvent) => {
      //   e.preventDefault();
      //   onEventStart('contextmenu', task, e);
      // }}
      onFocus={() => {
        onEventStart('select', task);
      }}
    >
      {taskItem.value}
    </g>
  );
};
