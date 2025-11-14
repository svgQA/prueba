import { ComponentType } from 'preact';
// import styles from './task-list-header.module.css';
import { type TaskListHeaderProps } from './task-list';
import { useTranslation } from 'react-i18next';

export const TaskListHeaderDefault: ComponentType<TaskListHeaderProps> = ({
  headerHeight,
  // fontFamily,
  // fontSize,
  // rowWidth,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className='flex justify-center items-center bg-primary dark:bg-ternary w-64 rounded-tl-lg border-b-2 dark:border-b-dark-light'
      style={{
        height: headerHeight,
      }}
    >
      <div className='font-bold text-center'>&nbsp;{t('h_name')}</div>
    </div>
  );
};
