import { useSortable } from '@dnd-kit/sortable';
import { flexRender, Header } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';
import { CSS } from '@dnd-kit/utilities';

interface IDraggableTableHeade<T> {
  header: Header<T, unknown>;
}

export const DraggableTableHeader = <T,>({
  header,
}: IDraggableTableHeade<T>) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    ...getCommonPinningStyles(header.column, isDragging),
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
  };

  return (
    <th ref={setNodeRef} colSpan={header.colSpan} style={style}>
      <div
        className={`flex justify-center ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}`}
        onClick={header.column.getToggleSortingHandler()}
      >
        {flexRender(header.column.columnDef.header, header.getContext())}
        {{
          asc: ' 🔼',
          desc: ' 🔽',
        }[header.column.getIsSorted() as string] ?? null}
        <span
          {...attributes}
          {...listeners}
          className='ml-2 cursor-move'
          role='button'
        >
          🟰
        </span>
      </div>
    </th>
  );
};
