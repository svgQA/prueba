import './index.css';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  ExpandedState,
  getExpandedRowModel,
  Column,
} from '@tanstack/react-table';
import { useState } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ITableProps } from './interface';
import React from 'preact/compat';
import { Search } from '../search/search';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const getCommonPinningStyles = (column: Column<any>) => {
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
    zIndex: isPinned ? 1 : 0,
  };
};

const DraggableTableHeader = ({
  header,
  index,
  lastIndex,
  openSettings,
  setOpenSettings,
}: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    ...getCommonPinningStyles(header.column),
    opacity: isDragging ? 0.8 : 1,
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
  };

  return (
    <th
      ref={setNodeRef}
      colSpan={header.colSpan}
      className='p-2 text-left font-semibold'
      style={style}
    >
      <div className='flex justify-between items-center'>
        <div
          className={
            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
          }
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {{
            asc: ' 🔼',
            desc: ' 🔽',
          }[header.column.getIsSorted() as string] ?? null}
          <button {...attributes} {...listeners} className='ml-2' role='button'>
            🟰
          </button>
        </div>
        {index === lastIndex && (
          <>
            <span
              className='px-2 vox-icon vx-icon-168 cursor-pointer size-sm'
              onClick={() => setOpenSettings(!openSettings)}
            />
          </>
        )}
      </div>
    </th>
  );
};

const DraggableCell = ({ cell }: any) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  const style = {
    ...getCommonPinningStyles(cell.column),
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

export const Table = <T,>({ data, columns, pageSize = 10 }: ITableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const openSettings = useSignal<boolean>(false);
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((c) => c.id as string)
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    columnResizeMode: 'onChange',
    state: {
      sorting,
      pagination,
      expanded,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const memoizedLeafColumns = React.useMemo(() => {
    return table
      .getAllLeafColumns()
      .map((column) => String(column.columnDef.header) || column.id);
  }, [table]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id);
        const newIndex = columnOrder.indexOf(over.id);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
    >
      <div className='w-full mb-2 flex flex-col items-end'>
        <Search
          id='search-general'
          name='search-general'
          keys={memoizedLeafColumns}
        />
      </div>

      <div className='relative w-full rounded-xl border-2 border-b-light-dark dark:border-b-dark-light scroll-x-md overflow-x-auto vox-scroll-design max-h-[80vh]'>
        <table className='w-full border-collapse info'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='sticky top-0'>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header, index) => (
                    <DraggableTableHeader
                      key={header.id}
                      header={header}
                      index={index}
                      lastIndex={headerGroup.headers.length - 1}
                      openSettings={openSettings.value}
                      setOpenSettings={(value: any) =>
                        (openSettings.value = value)
                      }
                    />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='h-14 hover:shadow'>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {row.getVisibleCells().map((cell) => (
                    <DraggableCell key={cell.id} cell={cell} />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex flex-row gap-3 justify-end p-3'>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='px-3 py-1 rounded text-t-light dark:text-t-dark'
        >
          PREV
        </button>
        {table.getPageOptions().map((page, index) => (
          <button
            key={index}
            onClick={() => table.setPageIndex(page)}
            className={`px-3 py-1 rounded text-t-light dark:text-t-dark ${
              table.getState().pagination.pageIndex === page ? 'font-bold' : ''
            }`}
          >
            {page + 1}
          </button>
        ))}
        {table.getPageCount() > 3 &&
        table.getState().pagination.pageIndex < table.getPageCount() - 3 ? (
          <span className='px-3 py-1 rounded'>...</span>
        ) : null}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='px-3 py-1 rounded text-t-light dark:text-t-dark'
        >
          NEXT
        </button>
      </div>
    </DndContext>
  );
};
