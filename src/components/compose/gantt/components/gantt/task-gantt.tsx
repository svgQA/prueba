import { useRef, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { VNode } from 'preact';
import { GridProps, Grid } from '../grid/grid';
import { CalendarProps, Calendar } from '../calendar/calendar';
import { TaskGanttContentProps, TaskGanttContent } from './task-gantt-content';
import styles from './gantt.module.css';

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
  onScrollX?: (scrollX: number) => void;
};

export const TaskGantt = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
  onScrollX,
}: TaskGanttProps): VNode => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);

  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const scrollLeft = useSignal(0);

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  const handleMouseDown = (e: MouseEvent) => {
    // Don't initiate drag if we're interacting with a task bar
    if ((e.target as HTMLElement).closest('.bar')) {
      return;
    }

    isDragging.value = true;
    startX.value = e.pageX - verticalGanttContainerRef.current!.offsetLeft;
    scrollLeft.value = verticalGanttContainerRef.current!.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.value = false;
  };

  const handleMouseUp = () => {
    isDragging.value = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    e.preventDefault();
    const x = e.pageX - verticalGanttContainerRef.current!.offsetLeft;
    const walk = (x - startX.value) * 2;
    const newScrollLeft = scrollLeft.value - walk;
    verticalGanttContainerRef.current!.scrollLeft = newScrollLeft;
    onScrollX?.(newScrollLeft);
  };

  return (
    <div
      className={`${styles.ganttVerticalContainer} cursor-grab`}
      ref={verticalGanttContainerRef}
      dir='ltr'
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={gridProps.svgWidth}
          height={ganttHeight}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
        </svg>
      </div>
    </div>
  );
};
