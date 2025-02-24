import { ComponentType } from 'preact';
import styles from './bar.module.css';

type BarDateHandleProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  barCornerRadius: number;
  onMouseDown: (event: MouseEvent) => void;
};

export const BarDateHandle: ComponentType<BarDateHandleProps> = ({
  x,
  y,
  width,
  height,
  barCornerRadius,
  onMouseDown,
}) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      className={styles.barHandle}
      ry={barCornerRadius}
      rx={barCornerRadius}
      onMouseDown={onMouseDown}
    />
  );
};
