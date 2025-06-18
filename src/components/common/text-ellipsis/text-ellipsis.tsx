import { JSX } from 'preact';
import { useRef, useEffect, useState } from 'preact/hooks';

interface TextEllipsisProps {
  text?: string;
  maxWidth?: string | number;
  className?: string;
  tooltip?: boolean;
  lines?: number;
  /** Si es 'report', muestra un círculo azul con el contenido centrado */
  type?: 'report';
  children?: JSX.Element | JSX.Element[];
}

export const TextEllipsis = ({
  text,
  maxWidth = '100%',
  className = '',
  tooltip = true,
  lines = 1,
  type,
  children,
}: TextEllipsisProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const overflow =
        el.scrollHeight > el.clientHeight ||
        el.scrollWidth > el.clientWidth;
      setIsOverflowing(overflow);
    }
  }, [text, maxWidth, children]);

  // estilo base para truncar texto multilínea
  const containerStyle = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
    WebkitLineClamp: lines,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  // si tipo es 'report', renderizo un badge circular azul
  if (type === 'report') {
    const content = children || text;
    return (
      <div
        ref={containerRef}
        className={`inline-flex items-center justify-center w-6 h-6 bg-cyan-500 text-white text-xs font-medium rounded-full ${className}`}
        title={tooltip && content ? String(content) : undefined}
      >
        {content}
      </div>
    );
  }

  // caso por defecto: truncado con tooltip si desborda
  return (
    <div
      ref={containerRef}
      style={containerStyle}
      className={`${className} ${tooltip && isOverflowing ? 'cursor-help' : ''}`}
      title={tooltip && isOverflowing ? String(children || text) : undefined}
    >
      {children || text}
    </div>
  );
};
