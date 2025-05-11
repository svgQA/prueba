import { useSortable } from '@dnd-kit/sortable';
import { Cell, flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';

export const DraggableCell = <T,>({
  cell,
  onCurrentColumnName,
  className = '',
}: {
  cell: Cell<T, unknown>;
  onCurrentColumnName: (columnName: string) => void;
  className?: string;
}) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  return (
    <td
      ref={setNodeRef}
      style={getCommonPinningStyles<T>(cell.column, isDragging, transform)}
      className={`text-left px-2 relative ${
        cell.column.getIsPinned() ? 'bg-b-light dark:bg-b-dark' : ''
      } ${className}`}
      onClick={() => {
        const columnName = cell.id.split('_')[1];
        onCurrentColumnName(columnName);
      }}
    >
      <span className='absolute top-0 left-0 w-full h-full bg-transparent border border-red-500 z-30' />
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
