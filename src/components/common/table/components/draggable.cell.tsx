import { useSortable } from '@dnd-kit/sortable';
import { Cell, flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';

export const DraggableCell = <T,>({
  cell,
  onCurrentColumnName,
}: {
  cell: Cell<T, unknown>;
  onCurrentColumnName: (columnName: string) => void;
}) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  return (
    <td
      ref={setNodeRef}
      style={getCommonPinningStyles<T>(cell.column, isDragging, transform)}
      className='text-left w-full'
      onClick={() => {
        const columnName = cell.id.split('_')[1];
        onCurrentColumnName(columnName);
      }}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
