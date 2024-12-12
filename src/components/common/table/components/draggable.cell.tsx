import { useSortable } from '@dnd-kit/sortable';
import { Cell, flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';

export const DraggableCell = <T,>({ cell }: { cell: Cell<T, unknown> }) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  return (
    <td
      ref={setNodeRef}
      style={getCommonPinningStyles<T>(cell.column, isDragging, transform)}
      className='text-center'
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
