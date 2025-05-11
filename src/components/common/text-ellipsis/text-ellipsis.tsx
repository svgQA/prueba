import { JSX } from 'preact';

interface TextEllipsisProps {
  text: string;
  maxWidth?: string | number;
  className?: string;
  tooltip?: boolean;
  lines?: number;
  children?: JSX.Element | JSX.Element[];
}

export const TextEllipsis = ({
  text,
  maxWidth = '100%',
  className = '',
  tooltip = true,
  lines = 1,
  children,
}: TextEllipsisProps) => {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const isOverflowing = useSignal(false);

  /*
  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      isOverflowing.value = element.scrollWidth > element.clientWidth;
    }
  }, [text, maxWidth]);
  */

  const containerStyle = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    WebkitLineClamp: lines,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <div
      // ref={containerRef}
      style={containerStyle}
      className={`${className} ${tooltip ? 'cursor-help' : ''}`}
      title={tooltip ? text : undefined}
    >
      {children || text}
    </div>
  );
};
