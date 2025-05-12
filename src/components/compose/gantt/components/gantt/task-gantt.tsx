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
  onScrollY?: (scrollY: number) => void;
};

export const TaskGantt = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  // scrollY,
  scrollX,
  onScrollX,
  // onScrollY,
}: TaskGanttProps): VNode => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  // const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const horizontalGanttContainerRef = useRef<HTMLDivElement>(null);

  const newBarProps = { ...barProps, svg: ganttSVGRef };
  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const scrollLeft = useSignal(0);
  const lastMouseX = useSignal(0);

  // Detect Safari browser
  const isSafari = useSignal(
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  );

  // useEffect(() => {
  //   if (horizontalContainerRef.current) {
  //     horizontalContainerRef.current.scrollTop = scrollY;
  //   }
  // }, [scrollY]);

  useEffect(() => {
    if (horizontalGanttContainerRef.current) {
      horizontalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  const throttledScroll = (newScrollLeft: number) => {
    if (isSafari.value || !window.requestAnimationFrame) {
      // Safari implementation - direct scroll
      horizontalGanttContainerRef.current!.scrollLeft = newScrollLeft;
      onScrollX?.(newScrollLeft);
    } else {
      // Chrome implementation - use requestAnimationFrame
      requestAnimationFrame(() => {
        horizontalGanttContainerRef.current!.scrollLeft = newScrollLeft;
        onScrollX?.(newScrollLeft);
      });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.bar')) {
      return;
    }
    e.preventDefault();
    isDragging.value = true;
    startX.value = isSafari.value
      ? e.pageX
      : e.pageX - horizontalGanttContainerRef.current!.offsetLeft;
    scrollLeft.value = horizontalGanttContainerRef.current!.scrollLeft;
    lastMouseX.value = e.pageX;
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    isDragging.value = false;
    document.body.style.cursor = 'auto';
  };

  const handleMouseUp = () => {
    isDragging.value = false;
    document.body.style.cursor = 'auto';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;
    e.preventDefault();

    if (isSafari.value) {
      // Safari implementation
      const dx = e.pageX - startX.value;
      const newScrollLeft = scrollLeft.value - dx;
      throttledScroll(newScrollLeft);
    } else {
      // Chrome implementation
      const mouseDelta = e.pageX - lastMouseX.value;
      lastMouseX.value = e.pageX;
      const newScrollLeft =
        horizontalGanttContainerRef.current!.scrollLeft - mouseDelta;
      throttledScroll(newScrollLeft);
    }
  };

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={horizontalGanttContainerRef}
      dir='ltr'
    >
      <div className='rounded-tr-lg bg-b-light-dark dark:bg-b-dark-light w-fit'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={gridProps.svgWidth}
          height={calendarProps.headerHeight}
          fontFamily={barProps.fontFamily}
        >
          <Calendar {...calendarProps} />
        </svg>
      </div>
      <div
        // ref={horizontalContainerRef}
        className={`${styles.horizontalContainer} cursor-grab`}
        style={
          ganttHeight
            ? { height: ganttHeight, width: gridProps.svgWidth }
            : { width: gridProps.svgWidth }
        }
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
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
