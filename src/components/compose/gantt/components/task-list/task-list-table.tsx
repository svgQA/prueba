// import { useMemo } from 'preact/hooks';
import { ComponentType } from 'preact';
import styles from './task-list-table.module.css';
import { User, TaskListTableProps } from '../../types/public-types';

export const TaskListTableDefault: ComponentType<TaskListTableProps> = ({
  rowHeight,
  tasks,
  onUserClick,
  onUserDoubleClick,
  selectedUsers,
}) => {
  /*
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );
 */

  return (
    <div>
      {tasks.users.map((t: User) => {
        const isSelected = selectedUsers.has(t.id);
        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={`hover:bg-m5 w-64 h-12 cursor-pointer items-center flex rounded-sm hover:text-white ${
                isSelected ? 'bg-ternary text-white' : ''
              }`}
              title={t.name}
              onClick={() => onUserClick?.(t.id)}
              onDblClick={() => onUserDoubleClick?.(t.id)}
            >
              <div className='flex justify-start items-center px-4'>
                <img
                  className='w-10 h-10 rounded-full object-cover mr-3'
                  src={t.image}
                  alt={`Profile photo of ${t.name}`}
                />
                <div className='text-lg font-medium'>{`${t.name} ${t.surname || ''}`}</div>
              </div>
            </div>
            {/*
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
              {t.phone}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              {t.cardId}
              &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
            </div>
              */}
          </div>
        );
      })}
    </div>
  );
};
