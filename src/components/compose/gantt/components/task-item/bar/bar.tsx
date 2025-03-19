import { FunctionComponent } from 'preact';
import { getProgressPoint } from '../../../helpers/bar-helper';
import { BarDisplay } from './bar-display';
import { BarDateHandle } from './bar-date-handle';
import { BarProgressHandle } from './bar-progress-handle';
import { TaskItemProps } from '../task-item';
import styles from './bar.module.css';

export const Bar: FunctionComponent<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  // const handleHeight = task.height - 2;
  const displayWidth = task.x2 - task.x1;

  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        name={task.name}
        width={displayWidth}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        // onMouseDown={(e) => {
        //   isDateChangeable && onEventStart('move', task, e);
        // }}
      />
      <g className='handleGroup'>
        {isDateChangeable && (
          <g>
            {/* left */}
            {/*
            <BarDateHandle
              x={task.x1 - 10}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEventStart('start', task, e);
              }}
            />
            */}
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={task.height - 2}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEventStart('end', task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEventStart('progress', task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
