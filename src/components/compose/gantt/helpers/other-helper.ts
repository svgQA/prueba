import { BarTask } from '../types/bar-task';
import { Task } from '../types/public-types';
import { JSX } from 'preact';

export function isKeyboardEvent(
  event:
    | JSX.TargetedKeyboardEvent<HTMLElement>
    | JSX.TargetedMouseEvent<HTMLElement>
    | JSX.TargetedFocusEvent<HTMLElement>
): event is JSX.TargetedKeyboardEvent<HTMLElement> {
  return (event as JSX.TargetedKeyboardEvent<HTMLElement>).key !== undefined;
}

export function isMouseEvent(
  event:
    | JSX.TargetedKeyboardEvent<HTMLElement>
    | JSX.TargetedMouseEvent<HTMLElement>
    | JSX.TargetedFocusEvent<HTMLElement>
): event is JSX.TargetedMouseEvent<HTMLElement> {
  return (event as JSX.TargetedMouseEvent<HTMLElement>).clientX !== undefined;
}

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}

/*
export function removeHiddenTasks(tasks: Task[]) {
  const groupedTasks = tasks.filter(
    (t) => t.hideChildren && t.type === 'project'
  );
  if (groupedTasks.length > 0) {
    for (let i = 0; groupedTasks.length > i; i++) {
      const groupedTask = groupedTasks[i];
      const children = getChildren(tasks, groupedTask);
      tasks = tasks.filter((t) => children.indexOf(t) === -1);
    }
  }
  return tasks;
}

function getChildren(taskList: Task[], task: Task) {
  let tasks: Task[] = [];
  if (task.type !== 'project') {
    tasks = taskList.filter(
      (t) => t.dependencies && t.dependencies.indexOf(task.id) !== -1
    );
  } else {
    tasks = taskList.filter((t) => t.project && t.project === task.id);
  }
  var taskChildren: Task[] = [];
  tasks.forEach((t) => {
    taskChildren.push(...getChildren(taskList, t));
  });
  tasks = tasks.concat(tasks, taskChildren);
  return tasks;
}
*/

export const sortTasks = (taskA: Task, taskB: Task) => {
  const orderA = taskA.displayOrder || Number.MAX_VALUE;
  const orderB = taskB.displayOrder || Number.MAX_VALUE;
  if (orderA > orderB) {
    return 1;
  } else if (orderA < orderB) {
    return -1;
  } else {
    return 0;
  }
};
