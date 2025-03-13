// import { useMemo } from 'preact/hooks';
import { ComponentType } from 'preact';
import styles from './task-list-table.module.css';
import { type TaskListTableProps } from './task-list';

/*
interface DateStringCache {
  [key: string]: string;
}

const localeDateStringCache: DateStringCache = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
*/

export const TaskListTableDefault: ComponentType<TaskListTableProps> = ({
  rowHeight,
  // rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onUserClick,
  // locale,
  // onExpanderClick,
}) => {
  /*
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );
 */

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.users.map((t) => {
        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className='hover:bg-m5 w-64 h-12 cursor-pointer items-center flex rounded-sm hover:text-white'
              title={t.name}
              onClick={() => onUserClick?.(t.id)}
            >
              <div
                className={`${styles.taskListNameWrapper} flex justify-start items-center px-4`}
              >
                {/*
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                */}
                <img
                  className='w-10 h-10 rounded-full object-cover mr-3'
                  src={t.image}
                  alt={`Profile photo of ${t.name}`}
                />
                <div className='text-lg font-medium'>{`${t.name} ${t.surname}`}</div>
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
