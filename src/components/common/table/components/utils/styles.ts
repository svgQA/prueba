import { Column } from '@tanstack/react-table';
import { CSSProperties } from 'preact/compat';
import { CSS, Transform } from '@dnd-kit/utilities';

const LIMIT_WIDTH = 60;
export const getCommonPinningStyles = <T>(
  column: Column<T>,
  isDragging: boolean,
  transform: Transform | null
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned && column.getIsLastColumn('left');
  const width = column.getSize() < LIMIT_WIDTH ? LIMIT_WIDTH : column.getSize();
  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-2px 0 2px -2px gray inset'
      : undefined,
    left: isPinned ? `${column.getStart('left') + 40}px` : undefined,
    // opacity: isDragging || isPinned ? 0.9 : 1,
    position: isPinned ? 'sticky' : 'relative',
    minWidth: width,
    zIndex: isDragging || isPinned ? 1 : 0,
    transition: isDragging ? 'width transform 0.2s ease-in-out' : undefined,
    transform: isDragging ? CSS.Translate.toString(transform) : undefined,
  };
};
