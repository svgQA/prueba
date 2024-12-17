import { useSortable } from '@dnd-kit/sortable';
import { flexRender, Header } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';

interface IDraggableTableHeade<T> {
  header: Header<T, unknown>;
}

export const DraggableTableHeader = <T,>({
  header,
}: IDraggableTableHeade<T>) => {
  const { isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });

  return (
    <th
      ref={setNodeRef}
      colSpan={header.colSpan}
      style={getCommonPinningStyles<T>(header.column, isDragging, transform)}
      className='text-center'
    >
      <div
        className={`flex flex-row justify-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
        onClick={header.column.getToggleSortingHandler()}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: <span className='vox-icon vx-icon-002 size-sm mx-1' />,
          desc: <span className='vox-icon vx-icon-001 size-sm mx-1' />,
        }[header.column.getIsSorted() as string] ?? null}
        {header.column.columnDef.id !== 'action' && (
          <span
            {...listeners}
            className='mx-1 cursor-move vox-icon vx-icon-031 size-sm'
          ></span>
        )}
      </div>
    </th>
  );
};
