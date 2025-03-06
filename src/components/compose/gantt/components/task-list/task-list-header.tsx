import { ComponentType } from 'preact';
import styles from './task-list-header.module.css';
import { type TaskListHeaderProps } from './task-list';

export const TaskListHeaderDefault: ComponentType<TaskListHeaderProps> = ({
  headerHeight,
  fontFamily,
  fontSize,
  // rowWidth,
}) => {
  return (
    <div
      className={`${styles.ganttTable} rounded-tl-md`}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      <div
        className='flex justify-center items-center bg-primary w-64 rounded-tl-md'
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          // style={{
          //   minWidth: rowWidth,
          // }}
          className='font-bold text-center'
        >
          &nbsp;Name
        </div>
        {/*
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Phone
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;CardId
        </div>
        */}
      </div>
    </div>
  );
};
