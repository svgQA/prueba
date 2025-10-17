import { IOption } from '@/components/common/multi/interface';
import { ComponentType, VNode } from 'preact';

export enum ViewMode {
  Hour = 'Hour',
  QuarterDay = 'Quarter Day',
  HalfDay = 'Half Day',
  Day = 'Day',
  /** ISO-8601 week */
  Week = 'Week',
  Month = 'Month',
  QuarterYear = 'QuarterYear',
  Year = 'Year',
}
export type TaskType = 'task' | 'milestone' | 'project';
export type TaskStatus = 'CREATED' | 'OPENED' | 'RESOLVED' | 'CLOSED';
export interface Task {
  // userID: string | number;
  id: string | number;
  end: string | Date;
  start: string | Date;
  serviceId: string | number;
  service: string;
  phone: string;
  contract: string;
  client: string;
  userId: string | number;
  cardId: string;
  type: TaskType;
  name: string;
  status: TaskStatus;
  progress: number;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
  isDisabled?: boolean;
  project?: string;
  dependencies?: string[];
  hideChildren?: boolean;
  displayOrder?: number;
}

export interface User {
  id: string | number;
  name: string;
  surname?: string;
  phone?: string;
  cardId?: string;
  image?: string;
  tasks: Task[];
}

export interface GeneralTask {
  startDate: Date;
  endDate: Date;
  users: User[];
}

export interface EventOption {
  /**
   * Time step value for date changes.
   */
  timeStep?: number;
  /**
   * Invokes on bar select on unselect.
   */
  onSelect?: (task: Task, isSelected: boolean) => void;
  /**
   * Invokes on bar double click.
   */
  onDoubleClick?: (task: Task) => void;
  /**
   * Invokes on bar click.
   */
  onClick?: (task: Task) => void;
  /**
   * Invokes on end and start time change. Chart undoes operation if method return false or error.
   */
  onDateChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on progress change. Chart undoes operation if method return false or error.
   */
  onProgressChange?: (
    task: Task,
    children: Task[]
  ) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on delete selected task. Chart undoes operation if method return false or error.
   */
  onDelete?: (task: Task) => void | boolean | Promise<void> | Promise<boolean>;
  /**
   * Invokes on expander on task list
   */
  onExpanderClick?: (task: Task) => void;
  /**
   * Invokes on task list row click
   */
  onUserClick?: (user: string | number) => void;
  /**
   * Invokes on task list row double click
   */
  onUserDoubleClick?: (user: string | number) => void;
}

export interface DisplayOption {
  viewMode?: ViewMode;
  viewDate?: Date;
  preStepsCount?: number;
  /**
   * Specifies the month name language. Able formats: ISO 639-2, Java Locale
   */
  locale?: string;
  rtl?: boolean;
}

export interface StylingOption {
  headerHeight?: number;
  columnWidth?: number;
  listCellWidth?: string;
  rowHeight?: number;
  ganttHeight?: number;
  barCornerRadius?: number;
  handleWidth?: number;
  fontFamily?: string;
  fontSize?: string;
  /**
   * How many of row width can be taken by task.
   * From 0 to 100
   */
  barFill?: number;
  barProgressColor?: string;
  barProgressSelectedColor?: string;
  barBackgroundColor?: string;
  barBackgroundSelectedColor?: string;
  projectProgressColor?: string;
  projectProgressSelectedColor?: string;
  projectBackgroundColor?: string;
  projectBackgroundSelectedColor?: string;
  milestoneBackgroundColor?: string;
  milestoneBackgroundSelectedColor?: string;
  arrowColor?: string;
  arrowIndent?: number;
  todayColor?: string;
  TooltipContent?: ComponentType<TooltipPublicProps>;
  TaskListHeader?: ComponentType<TaskListHeaderProps>;
  TaskListTable?: ComponentType<TaskListTableProps>;
}

export interface TaskListHeaderProps {
  headerHeight: number;
  rowWidth: string | number;
  fontFamily: string;
  fontSize: string | number;
}

export type TaskListTableProps = {
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: GeneralTask;
  selectedTaskId: string;
  onUserClick?: (userId: string | number) => void;
  onUserDoubleClick?: (userId: string | number) => void;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  selectedUsers: Set<string | number>;
};

export interface TaskListProps {
  headerHeight: number;
  rowWidth: string | number;
  fontFamily: string;
  fontSize: string | number;
}

export interface TooltipPublicProps {
  task: Task;
  fontSize: string;
  fontFamily: string;
}

export interface GanttProps extends EventOption, DisplayOption, StylingOption {
  // tasks: Task[];
  unsearch?: boolean;
  tasks: GeneralTask;
  group?: VNode;
  users?: IOption[];
  onReloadSignal?: () => void;
  button?: VNode;
}
