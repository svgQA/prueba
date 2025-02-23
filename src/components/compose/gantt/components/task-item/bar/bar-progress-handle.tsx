import { ComponentType } from 'preact';
import styles from './bar.module.css';

type BarProgressHandleProps = {
  progressPoint: string;
  onMouseDown: (event: MouseEvent) => void;
};
export const BarProgressHandle: ComponentType<BarProgressHandleProps> = ({
  progressPoint,
  onMouseDown,
}) => {
  return (
    <polygon
      className={styles.barHandle}
      points={progressPoint}
      onMouseDown={onMouseDown}
    />
  );
};
