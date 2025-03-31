import { ComponentType } from 'preact';
import { useSignal } from '@preact/signals';
import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'preact/hooks';
import {
  ViewMode,
  GanttProps,
  Task,
  GeneralTask,
} from '../../types/public-types';
import { ganttDateRange, seedDates } from '../../helpers/date-helper';
import { TaskListHeaderDefault } from '../task-list/task-list-header';
import { TaskListTableDefault } from '../task-list/task-list-table';
import { StandardTooltipContent, Tooltip } from '../other/tooltip';
import { VerticalScroll } from '../other/vertical-scroll';
import { TaskListProps, TaskList } from '../task-list/task-list';
import { TaskGantt } from './task-gantt';
import { BarTask } from '../../types/bar-task';
import { convertToBarTasks } from '../../helpers/bar-helper';
import { GanttEvent } from '../../types/gantt-task-actions';
import { DateSetup } from '../../types/date-setup';
import { HorizontalScroll } from '../other/horizontal-scroll';
import styles from './gantt.module.css';
import { TaskGanttContentProps } from './task-gantt-content';
import { CalendarProps } from '../calendar/calendar';
import { GridProps } from '../grid/grid';
import { memo } from 'preact/compat';
import { Search } from '@/components/common/search/search';
import { ColumnFiltersState } from '@tanstack/react-table';
import { DateSelector } from './replicate.modal';

// interface ColumnFilter {
//   id: string;
//   value: string;
// }

const GanttComponent: ComponentType<GanttProps> = ({
  tasks: initialTasks,
  headerHeight = 50,
  columnWidth = 60,
  listCellWidth = '155px',
  rowHeight = 50,
  ganttHeight = 0,
  viewMode = ViewMode.Day,
  preStepsCount = 1,
  locale = 'en-GB',
  barFill = 60,
  barCornerRadius = 3,
  barProgressColor = '#a3a3ff',
  barProgressSelectedColor = '#8282f5',
  barBackgroundColor = '#b8c2cc',
  barBackgroundSelectedColor = '#aeb8c2',
  projectProgressColor = '#7db59a',
  projectProgressSelectedColor = '#59a985',
  projectBackgroundColor = '#fac465',
  projectBackgroundSelectedColor = '#f7bb53',
  milestoneBackgroundColor = '#f1c453',
  milestoneBackgroundSelectedColor = '#f29e4c',
  rtl = false,
  handleWidth = 8,
  timeStep = 300000,
  arrowColor = 'grey',
  fontFamily = 'Arial, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue',
  fontSize = '14px',
  arrowIndent = 20,
  todayColor = 'rgba(252, 248, 227, 0.5)',
  viewDate,
  TooltipContent = StandardTooltipContent,
  TaskListHeader = TaskListHeaderDefault,
  TaskListTable = TaskListTableDefault,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onSelect,
  onExpanderClick,
  onUserClick,
  onUserDoubleClick,
  unsearch,
  group,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const taskListRef = useRef<HTMLDivElement>(null);
  const [dateSetup, setDateSetup] = useState<DateSetup>(() => {
    const [startDate, endDate] = ganttDateRange(
      initialTasks,
      viewMode,
      preStepsCount
    );
    return { viewMode, dates: seedDates(startDate, endDate, viewMode) };
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const currentViewDate = useSignal<Date | undefined>(undefined);
  const taskListWidth = useSignal(0);
  const svgContainerWidth = useSignal(0);
  const svgContainerHeight = useSignal(ganttHeight);
  const [barTasks, setBarTasks] = useState<BarTask[]>([]);
  const [ganttEvent, setGanttEvent] = useState<GanttEvent>({
    action: '',
  });

  const taskHeight = useMemo(
    () => (rowHeight * barFill) / 100 + 16,
    [rowHeight, barFill]
  );

  const [selectedTask, setSelectedTask] = useState<BarTask>();
  const [failedTask, setFailedTask] = useState<BarTask | null>(null);

  const svgWidth = dateSetup.dates.length * columnWidth;
  const ganttFullHeight = initialTasks.users.length * rowHeight;

  const scrollY = useSignal(0);
  const scrollX = useSignal(-1);
  const [ignoreScrollEvent, setIgnoreScrollEvent] = useState(false);

  const [tasks, setTasks] = useState<GeneralTask>(initialTasks);
  const [selectedUsers, setSelectedUsers] = useState<Set<string | number>>(
    new Set()
  );

  const handleDateSubmit = (start: string, end: string) => {
    // Aquí puedes manejar la lógica para las fechas seleccionadas
    console.log('Start Date:', start);
    console.log('End Date:', end);
  };

  useEffect(() => {
    const [startDate, endDate] = ganttDateRange(
      initialTasks,
      viewMode,
      preStepsCount
    );
    let newDates = seedDates(startDate, endDate, viewMode);
    if (rtl) {
      newDates = newDates.reverse();
      if (scrollX.value === -1) {
        scrollX.value = newDates.length * columnWidth;
      }
    }
    setDateSetup({ dates: newDates, viewMode });
    setBarTasks(
      convertToBarTasks(
        initialTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      )
    );
  }, [
    initialTasks,
    viewMode,
    preStepsCount,
    rowHeight,
    barCornerRadius,
    columnWidth,
    taskHeight,
    handleWidth,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
    rtl,
    scrollX,
  ]);

  useEffect(() => {
    if (
      viewMode === dateSetup.viewMode &&
      ((viewDate && !currentViewDate.value) ||
        (viewDate && currentViewDate.value?.valueOf() !== viewDate.valueOf()))
    ) {
      const dates = dateSetup.dates;
      const index = dates.findIndex(
        (d, i) =>
          viewDate.valueOf() >= d.valueOf() &&
          i + 1 !== dates.length &&
          viewDate.valueOf() < dates[i + 1].valueOf()
      );
      if (index === -1) {
        return;
      }
      currentViewDate.value = viewDate;
      scrollX.value = columnWidth * index;
    }
  }, [
    viewDate,
    columnWidth,
    dateSetup.dates,
    dateSetup.viewMode,
    viewMode,
    currentViewDate,
  ]);

  useEffect(() => {
    const { changedTask, action } = ganttEvent;
    if (changedTask) {
      if (action === 'delete') {
        setGanttEvent({ action: '' });
        setBarTasks(barTasks.filter((t) => t.id !== changedTask.id));
      } else if (
        action === 'move' ||
        action === 'end' ||
        action === 'start' ||
        action === 'progress'
      ) {
        const prevStateTask = barTasks.find((t) => t.id === changedTask.id);
        if (
          prevStateTask &&
          (prevStateTask.start.getTime() !== changedTask.start.getTime() ||
            prevStateTask.end.getTime() !== changedTask.end.getTime() ||
            prevStateTask.progress !== changedTask.progress)
        ) {
          const newTaskList = barTasks.map((t) =>
            t.id === changedTask.id ? changedTask : t
          );
          setBarTasks(newTaskList);
        }
      }
    }
  }, [ganttEvent, barTasks]);

  useEffect(() => {
    if (failedTask) {
      setBarTasks(
        barTasks.map((t) => (t.id !== failedTask.id ? t : failedTask))
      );
      setFailedTask(null);
    }
  }, [failedTask, barTasks]);

  useEffect(() => {
    if (!listCellWidth) {
      taskListWidth.value = 0;
    }
    if (taskListRef.current) {
      taskListWidth.value = taskListRef.current.offsetWidth;
    }
  }, [taskListRef, listCellWidth]);

  useEffect(() => {
    if (wrapperRef.current) {
      svgContainerWidth.value =
        wrapperRef.current.offsetWidth - taskListWidth.value;
    }
  }, [wrapperRef, taskListWidth]);

  useEffect(() => {
    if (ganttHeight) {
      svgContainerHeight.value = ganttHeight + headerHeight;
    } else {
      svgContainerHeight.value =
        initialTasks.users.length * rowHeight + headerHeight;
    }
  }, [ganttHeight, initialTasks, headerHeight, rowHeight]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.shiftKey || event.deltaX) {
        const scrollMove = event.deltaX ? event.deltaX : event.deltaY;
        let newScrollX = scrollX.value + scrollMove;
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        scrollX.value = newScrollX;
        event.preventDefault();
      } else if (ganttHeight) {
        let newScrollY = scrollY.value + event.deltaY;
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        if (newScrollY !== scrollY.value) {
          scrollY.value = newScrollY;
          event.preventDefault();
        }
      }

      setIgnoreScrollEvent(true);
    },
    [scrollX, scrollY, svgWidth, ganttHeight, ganttFullHeight]
  );

  useEffect(() => {
    wrapperRef.current?.addEventListener('wheel', handleWheel, {
      passive: false,
    });
    return () => {
      wrapperRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  const handleScrollY = useCallback(
    (event: UIEvent) => {
      if (
        scrollY.value !== (event.target as HTMLElement).scrollTop &&
        !ignoreScrollEvent
      ) {
        scrollY.value = (event.target as HTMLElement).scrollTop;
        setIgnoreScrollEvent(true);
      } else {
        setIgnoreScrollEvent(false);
      }
    },
    [scrollY, ignoreScrollEvent]
  );

  const handleScrollX = useCallback(
    (event: UIEvent) => {
      if (
        scrollX.value !== (event.target as HTMLElement).scrollLeft &&
        !ignoreScrollEvent
      ) {
        scrollX.value = (event.target as HTMLElement).scrollLeft;
        setIgnoreScrollEvent(true);
      } else {
        setIgnoreScrollEvent(false);
      }
    },
    [scrollX, ignoreScrollEvent]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      let newScrollY = scrollY.value;
      let newScrollX = scrollX.value;
      let isX = true;
      switch (event.key) {
        case 'Down':
        case 'ArrowDown':
          newScrollY += rowHeight;
          isX = false;
          break;
        case 'Up':
        case 'ArrowUp':
          newScrollY -= rowHeight;
          isX = false;
          break;
        case 'Left':
        case 'ArrowLeft':
          newScrollX -= columnWidth;
          break;
        case 'Right':
        case 'ArrowRight':
          newScrollX += columnWidth;
          break;
      }
      if (isX) {
        if (newScrollX < 0) {
          newScrollX = 0;
        } else if (newScrollX > svgWidth) {
          newScrollX = svgWidth;
        }
        scrollX.value = newScrollX;
      } else {
        if (newScrollY < 0) {
          newScrollY = 0;
        } else if (newScrollY > ganttFullHeight - ganttHeight) {
          newScrollY = ganttFullHeight - ganttHeight;
        }
        scrollY.value = newScrollY;
      }
      setIgnoreScrollEvent(true);
    },
    [
      scrollY,
      scrollX,
      rowHeight,
      columnWidth,
      svgWidth,
      ganttFullHeight,
      ganttHeight,
    ]
  );

  const handleSelectedTask = useCallback(
    (taskId: string | number) => {
      const newSelectedTask = barTasks.find((t) => t.id === taskId);
      const oldSelectedTask = barTasks.find(
        (t) => !!selectedTask && t.id === selectedTask.id
      );
      if (onSelect) {
        if (oldSelectedTask) {
          onSelect(
            {
              ...oldSelectedTask,
              start: oldSelectedTask.start.toString(),
              end: oldSelectedTask.end.toString(),
            },
            false
          );
        }
        if (newSelectedTask) {
          onSelect(
            {
              ...newSelectedTask,
              start: newSelectedTask.start.toString(),
              end: newSelectedTask.end.toString(),
            },
            true
          );
        }
      }
      setSelectedTask(newSelectedTask);
    },
    [barTasks, selectedTask, onSelect]
  );

  const handleExpanderClick = useCallback(
    (task: Task) => {
      if (onExpanderClick && task.hideChildren !== undefined) {
        onExpanderClick({ ...task, hideChildren: !task.hideChildren });
      }
    },
    [onExpanderClick]
  );

  const handleUserClick = useCallback(
    (user: string | number) => {
      setSelectedUsers((prev) => {
        const newSelected = new Set(prev);
        if (newSelected.has(user)) {
          newSelected.delete(user);
        } else {
          newSelected.add(user);
        }
        return newSelected;
      });

      // if (onUserClick) {
      //   onUserClick(user);
      // }
    },
    [onUserClick]
  );

  const handleUserDblClick = useCallback(
    (user: string | number) => {
      if (onUserDoubleClick) {
        onUserDoubleClick(user);
      }
    },
    [onUserClick]
  );

  const gridProps = useMemo<GridProps>(
    () => ({
      columnWidth,
      svgWidth,
      tasks: tasks,
      rowHeight,
      dates: dateSetup.dates,
      todayColor,
      rtl,
    }),
    [columnWidth, svgWidth, tasks, rowHeight, dateSetup.dates, todayColor, rtl]
  );

  const calendarProps = useMemo<CalendarProps>(
    () => ({
      dateSetup,
      locale,
      viewMode,
      headerHeight,
      columnWidth,
      fontFamily,
      fontSize,
      rtl,
    }),
    [
      dateSetup,
      locale,
      viewMode,
      headerHeight,
      columnWidth,
      fontFamily,
      fontSize,
      rtl,
    ]
  );

  const barProps = useMemo<TaskGanttContentProps>(
    () => ({
      tasks: barTasks,
      dates: dateSetup.dates,
      ganttEvent,
      selectedTask,
      rowHeight,
      taskHeight,
      columnWidth,
      arrowColor,
      timeStep,
      fontFamily,
      fontSize,
      arrowIndent,
      svgWidth,
      rtl,
      setGanttEvent,
      setFailedTask,
      setSelectedTask: handleSelectedTask,
      onDateChange,
      onProgressChange,
      onDoubleClick,
      onClick,
      onDelete,
    }),
    [
      barTasks,
      dateSetup.dates,
      ganttEvent,
      selectedTask,
      rowHeight,
      taskHeight,
      columnWidth,
      arrowColor,
      timeStep,
      fontFamily,
      fontSize,
      arrowIndent,
      svgWidth,
      rtl,
      handleSelectedTask,
      onDateChange,
      onProgressChange,
      onDoubleClick,
      onClick,
      onDelete,
    ]
  );

  const tableProps = useMemo<TaskListProps>(
    () => ({
      rowHeight,
      rowWidth: listCellWidth,
      fontFamily,
      fontSize,
      tasks: tasks,
      locale,
      headerHeight,
      scrollY: scrollY.value,
      ganttHeight,
      horizontalContainerClass: styles.horizontalContainer,
      selectedTask,
      taskListRef,
      setSelectedTask: handleSelectedTask,
      onExpanderClick: handleExpanderClick,
      TaskListHeader,
      TaskListTable,
      onUserClick: handleUserClick,
      onUserDoubleClick: handleUserDblClick,
      selectedUsers,
    }),
    [
      rowHeight,
      listCellWidth,
      fontFamily,
      fontSize,
      tasks,
      locale,
      headerHeight,
      scrollY,
      ganttHeight,
      selectedTask,
      handleSelectedTask,
      handleExpanderClick,
      TaskListHeader,
      TaskListTable,
      handleUserClick,
      handleUserDblClick,
      selectedUsers,
    ]
  );

  useEffect(() => {
    if (columnFilters.length === 0) {
      setTasks(initialTasks);
      // Actualizar barTasks con todas las tareas cuando no hay filtros
      const [startDate, endDate] = ganttDateRange(
        initialTasks,
        viewMode,
        preStepsCount
      );
      const newDates = rtl
        ? seedDates(startDate, endDate, viewMode).reverse()
        : seedDates(startDate, endDate, viewMode);
      setBarTasks(
        convertToBarTasks(
          initialTasks,
          newDates,
          columnWidth,
          rowHeight,
          taskHeight,
          barCornerRadius,
          handleWidth,
          rtl,
          barProgressColor,
          barProgressSelectedColor,
          barBackgroundColor,
          barBackgroundSelectedColor,
          projectProgressColor,
          projectProgressSelectedColor,
          projectBackgroundColor,
          projectBackgroundSelectedColor,
          milestoneBackgroundColor,
          milestoneBackgroundSelectedColor
        )
      );
      return;
    }

    const filteredUsers = initialTasks.users
      .filter((user) => {
        // Filtrar a nivel de usuario primero
        const userLevelFilters = columnFilters.filter(
          (filter) => filter.id === 'name' || filter.id === 'cardId'
        );

        if (userLevelFilters.length > 0) {
          return userLevelFilters.every((filter) => {
            const filterValue = filter.value as string;
            switch (filter.id) {
              case 'name':
                return user.name
                  .toLowerCase()
                  .includes(filterValue.toLowerCase());
              case 'cardId':
                return user.cardId
                  ?.toLowerCase()
                  .includes(filterValue.toLowerCase());
              default:
                return true;
            }
          });
        }
        return true;
      })
      .map((user) => {
        // Filtrar las tareas del usuario
        const taskLevelFilters = columnFilters.filter(
          (filter) => !['name', 'cardId'].includes(filter.id)
        );

        const filteredTasks = user.tasks.filter((task) => {
          return taskLevelFilters.every((filter) => {
            const filterValue = filter.value as string;
            switch (filter.id) {
              case 'task.service':
                return task.name
                  .toLowerCase()
                  .includes(filterValue.toLowerCase());
              case 'task.contract':
                return task.contract
                  .toLowerCase()
                  .includes(filterValue.toLowerCase());
              case 'task.client':
                return task.client
                  .toLowerCase()
                  .includes(filterValue.toLowerCase());
              case 'task.status':
                return task.status
                  .toLowerCase()
                  .includes(filterValue.toLowerCase());
              default:
                return true;
            }
          });
        });

        return {
          ...user,
          tasks: filteredTasks,
        };
      })
      .filter(
        (user) =>
          user.tasks.length > 0 ||
          columnFilters.some((f) => f.id === 'name' || f.id === 'cardId')
      );

    const filteredTasks = {
      ...initialTasks,
      users: filteredUsers,
    };

    setTasks(filteredTasks);

    // Actualizar barTasks con las tareas filtradas
    const [startDate, endDate] = ganttDateRange(
      initialTasks,
      viewMode,
      preStepsCount
    );
    const newDates = rtl
      ? seedDates(startDate, endDate, viewMode).reverse()
      : seedDates(startDate, endDate, viewMode);
    setBarTasks(
      convertToBarTasks(
        filteredTasks,
        newDates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      )
    );
  }, [
    columnFilters,
    initialTasks,
    viewMode,
    preStepsCount,
    columnWidth,
    rowHeight,
    taskHeight,
    barCornerRadius,
    handleWidth,
    rtl,
    barProgressColor,
    barProgressSelectedColor,
    barBackgroundColor,
    barBackgroundSelectedColor,
    projectProgressColor,
    projectProgressSelectedColor,
    projectBackgroundColor,
    projectBackgroundSelectedColor,
    milestoneBackgroundColor,
    milestoneBackgroundSelectedColor,
  ]);

  return (
    <div>
      <div className='relative w-full my-2 flex items-center justify-end gap-2'>
        <DateSelector
          selectedUsers={selectedUsers}
          onDateSubmit={handleDateSubmit}
        />

        {!unsearch && (
          <Search
            id='search-general'
            name='search-general'
            keys={[
              { label: 'Nombre', id: 'name' },
              { label: 'Estado', id: 'task.status' },
              { label: 'Identificador', id: 'cardId' },
              { label: 'Servicio', id: 'task.service' },
              { label: 'Contrato', id: 'task.contract' },
              { label: 'Cliente', id: 'task.client' },
            ]}
            onChange={setColumnFilters}
            group={group}
            grouping
          />
        )}
      </div>
      <div
        className={`${styles.wrapper} border-2 border-gray-100 dark:border-b-dark-light rounded-xl min-h-[30vh]`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={wrapperRef}
      >
        {listCellWidth && <TaskList {...tableProps} />}
        <TaskGantt
          gridProps={gridProps}
          calendarProps={calendarProps}
          barProps={barProps}
          ganttHeight={ganttFullHeight}
          scrollY={scrollY.value}
          scrollX={scrollX.value}
          onScrollX={(value: number) => {
            scrollX.value = value;
          }}
        />
        {ganttEvent.changedTask && (
          <Tooltip
            arrowIndent={arrowIndent}
            rowHeight={rowHeight}
            svgContainerHeight={svgContainerHeight.value}
            svgContainerWidth={svgContainerWidth.value}
            fontFamily={fontFamily}
            fontSize={fontSize}
            scrollX={scrollX.value}
            scrollY={scrollY.value}
            task={ganttEvent.changedTask}
            headerHeight={headerHeight}
            taskListWidth={taskListWidth.value}
            TooltipContent={TooltipContent}
            rtl={rtl}
            svgWidth={svgWidth}
          />
        )}
        <VerticalScroll
          ganttFullHeight={ganttFullHeight}
          ganttHeight={ganttHeight}
          headerHeight={headerHeight}
          scroll={scrollY.value}
          onScroll={handleScrollY}
          rtl={rtl}
        />
      </div>
      <HorizontalScroll
        svgWidth={svgWidth}
        taskListWidth={taskListWidth.value}
        scroll={scrollX.value}
        rtl={rtl}
        onScroll={handleScrollX}
      />
    </div>
  );
};

export const Gantt = memo(GanttComponent);
