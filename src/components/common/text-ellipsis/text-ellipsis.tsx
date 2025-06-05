import { JSX } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';

interface TextEllipsisProps {
  text?: string;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      const isTextOverflowing = element.scrollHeight > element.clientHeight || 
                              element.scrollWidth > element.clientWidth;
      setIsOverflowing(isTextOverflowing);
    }
  }, [text, maxWidth, children]);

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
      ref={containerRef}
      style={containerStyle}
      className={`${className} ${tooltip && isOverflowing ? 'cursor-help' : 'cursor-default'}`}
      title={tooltip && isOverflowing ? text : undefined}
    >
      {children || text}
    </div>
  );
};
