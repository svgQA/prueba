import { Column } from '@tanstack/react-table';
import { CSSProperties } from 'preact/compat';

export const getCommonPinningStyles = (
  column: Column<any>,
  isDragging: boolean
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    whiteSpace: 'nowrap',
    zIndex: isPinned || isDragging ? 1 : 0,
  };
};
