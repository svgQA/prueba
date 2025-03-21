import { ComponentType } from 'preact';
// import styles from './task-list-header.module.css';
import { type TaskListHeaderProps } from './task-list';

export const TaskListHeaderDefault: ComponentType<TaskListHeaderProps> = ({
  headerHeight,
  // fontFamily,
  // fontSize,
  // rowWidth,
}) => {
  return (
    <div
      className='flex justify-center items-center bg-primary w-64 rounded-tl-lg border-b-2 dark:border-b-dark-light'
      style={{
        height: headerHeight,
      }}
    >
      <div className='font-bold text-center'>&nbsp;Name</div>
    </div>
  );
};
