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
    isDateChangeable,
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
      onDblClick={(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEventStart('dblclick', task, e);
      }}
      onClick={(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEventStart('click', task, e);
      }}
    >
      {taskItem.value}
      <g
        className='cursor-move'
        transform={`translate(${task.x1},${task.y})`}
        onKeyDown={(e: KeyboardEvent) => {
          e.preventDefault();
          e.stopPropagation();
          switch (e.key) {
            case 'Delete': {
              if (isDelete) onEventStart('delete', task, e);
              break;
            }
          }
        }}
        onMouseEnter={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onEventStart('mouseenter', task, e);
        }}
        onMouseDown={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          isDateChangeable && onEventStart('move', task, e);
        }}
        onMouseLeave={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onEventStart('mouseleave', task, e);
        }}
        onFocus={(e: FocusEvent) => {
          e.preventDefault();
          e.stopPropagation();
          onEventStart('select', task);
        }}
      >
        <rect
          width={30}
          height={task.height}
          ry={task.barCornerRadius}
          rx={task.barCornerRadius}
          fill={task.styles.backgroundSelectedColor}
        />
        <path
          d='M8 12C8 7.58 11.58 4 16 4C20.42 4 24 7.58 24 12C24 16.42 20.42 20 16 20C11.58 20 8 16.42 8 12ZM16 2C10.48 2 6 6.48 6 12C6 17.52 10.48 22 16 22C21.52 22 26 17.52 26 12C26 6.48 21.52 2 16 2ZM16.5 7V12.25L21 15L20.25 16.25L15 13V7H16.5Z'
          fill='white'
          transform='translate(-0.5,12)'
        />
      </g>
    </g>
  );
};
