import { useEffect, useRef } from 'preact/hooks';
import styles from './horizontal-scroll.module.css';

export const HorizontalScroll = ({
  scroll,
  svgWidth,
  // taskListWidth,
  // rtl,
  onScroll,
}: {
  scroll: number;
  svgWidth: number;
  taskListWidth?: number;
  rtl?: boolean;
  onScroll: (event: UIEvent) => void;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scroll;
    }
  }, [scroll]);

  return (
    <div
      dir='ltr'
      style={
        {
          // margin: rtl
          //   ? `0px ${taskListWidth}px 0px 0px`
          //   : `0px 0px 0px ${taskListWidth}px`,
        }
      }
      // className={styles.scrollWrapper}
      className={styles.scrollWrapper}
      // className='vox-scroll-design my-2'
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div style={{ width: svgWidth }} className={styles.scroll} />
    </div>
  );
};
