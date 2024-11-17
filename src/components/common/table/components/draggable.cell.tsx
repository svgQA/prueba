import { useSortable } from '@dnd-kit/sortable';
import { Cell, flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';
import { CSS } from '@dnd-kit/utilities';

export const DraggableCell = <T,>({ cell }: { cell: Cell<T, unknown> }) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  const style = {
    ...getCommonPinningStyles(cell.column, isDragging),
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
  };

  return (
    <td ref={setNodeRef} style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
