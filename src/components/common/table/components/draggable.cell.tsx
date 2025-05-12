import { useSortable } from '@dnd-kit/sortable';
import { Cell, flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';
import { NColumnDef } from '../type';

// onCurrentColumnName: (columnName: string) => void;
interface DraggableCellProps<T> {
  cell: Cell<T, unknown>;
  className?: string;
  rowId: string;
  selected?: boolean;
}

export const DraggableCell = <T,>({
  cell,
  rowId,
  selected = false,
}: DraggableCellProps<T>) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  const isClickable = (cell.column.columnDef as NColumnDef<T>).clickable;

  return (
    <td
      ref={setNodeRef}
      style={getCommonPinningStyles<T>(cell.column, isDragging, transform)}
      className={`text-left px-2 relative ${
        cell.column.getIsPinned() ? 'bg-b-light dark:bg-b-dark' : ''
      } ${selected ? 'bg-b-light-ligth dark:bg-b-dark-dark' : ''}`}
    >
      {/* Este span es para que el usuario pueda hacer click en la celda NO TOCAR */}
      {isClickable && cell.column.id !== 'actions' && (
        <span
          className='absolute top-0 left-0 w-full h-full bg-transparent z-20 cursor-pointer'
          data-id={cell.column.id}
          data-type='cell'
          data-action='click'
          data-clickable={isClickable}
          data-row-id={rowId}
        ></span>
      )}
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};
