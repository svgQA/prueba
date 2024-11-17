import './index.css';
import {
  flexRender,
  getCoreRowModel,
  // getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  // ExpandedState,
  // getExpandedRowModel,
  // Column,
  Cell,
  Header,
  ColumnDef,
} from '@tanstack/react-table';
import { useMemo, useState } from 'preact/hooks';
// import { useSignal } from '@preact/signals';
import { ITableProps } from './interface';
import { CSSProperties } from 'preact/compat';
// import { Search } from '../search/search';
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
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

// const getCommonPinningStyles = (column: Column<any>, isDragging: boolean) => {
//   const isPinned = column.getIsPinned();
//   const isLastLeftPinnedColumn =
//     isPinned === 'left' && column.getIsLastColumn('left');

//   return {
//     boxShadow: isLastLeftPinnedColumn
//       ? '-4px 0 4px -4px gray inset'
//       : undefined,
//     left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
//     position: isPinned ? 'sticky' : 'relative',
//     width: column.getSize(),
//     whiteSpace: 'nowrap',
//     zIndex: isPinned || isDragging ? 1 : 0,
//   };
// };

const DraggableTableHeader = <T,>({
  header,
  // index,
  // lastIndex,
  // openSettings,
  // setOpenSettings,
}: {
  header: Header<T, unknown>;
}) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  // const style = {
  //   ...getCommonPinningStyles(header.column, isDragging),
  //   opacity: isDragging ? 0.8 : 1,
  //   transform: CSS.Translate.toString(transform),
  //   transition: 'width transform 0.2s ease-in-out',
  // };

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <th
      ref={setNodeRef}
      colSpan={header.colSpan}
      style={style}
      className='py-3'
    >
      <div className='flex justify-center'>
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
          <span
            {...attributes}
            {...listeners}
            className='ml-2 cursor-move'
            role='button'
          >
            🟰
          </span>
        </div>
        {/*
        {index === lastIndex && (
          <>
            <span
              className='px-2 vox-icon vx-icon-168 cursor-pointer size-sm'
              onClick={() => setOpenSettings(!openSettings)}
            />
          </>
        )}
        */}
      </div>
    </th>
  );
};

const DraggableCell = <T,>({ cell }: { cell: Cell<T, unknown> }) => {
  const { setNodeRef, isDragging, transform } = useSortable({
    id: cell.column.id,
  });

  // const style = {
  //   ...getCommonPinningStyles(cell.column, isDragging),
  //   opacity: isDragging ? 0.8 : 1,
  //   transform: CSS.Translate.toString(transform),
  //   transition: 'width transform 0.2s ease-in-out',
  // };
  //
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: 'relative',
    transform: CSS.Translate.toString(transform),
    transition: 'width transform 0.2s ease-in-out',
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <td ref={setNodeRef} style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </td>
  );
};

export const Table = <T,>({ data, columns, pageSize = 10 }: ITableProps<T>) => {
  const columnsData = useMemo<ColumnDef<T>[]>(() => columns, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  // const openSettings = useSignal<boolean>(false);
  // const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState(() =>
    columnsData.map((c) => c.id as string)
  );

  const table = useReactTable({
    data,
    columns: columnsData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    // onExpandedChange: setExpanded,
    // columnResizeMode: 'onChange',
    state: {
      sorting,
      pagination,
      // expanded,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // const memoizedLeafColumns = React.useMemo(() => {
  //   return table
  //     .getAllLeafColumns()
  //     .map((column) => String(column.columnDef.header) || column.id);
  // }, [table]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <>
      {/* <div className='w-full mb-2 flex flex-col items-end'>
        <Search
          id='search-general'
          name='search-general'
          // keys={memoizedLeafColumns}
        />
      </div> */}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className='relative w-full rounded-xl border-2 border-b-light-dark dark:border-b-dark-light scroll-x-md overflow-x-auto vox-scroll-design max-h-[80vh]'>
          <table className='w-full border-collapse info'>
            {/* className='w-full border-collapse info' (arriba) */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='sticky top-0'>
                  {/* className='sticky top-0' (arriba) */}
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader<T>
                        key={header.id}
                        header={header}
                        // index={index}
                        // lastIndex={headerGroup.headers.length - 1}
                        // openSettings={openSettings.value}
                        // setOpenSettings={(value: any) =>
                        //   (openSettings.value = value)
                        // }
                      />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className='h-12'>
                  {row.getVisibleCells().map((cell) => (
                    <SortableContext
                      key={cell.id}
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      <DraggableCell<T> key={cell.id} cell={cell} />
                    </SortableContext>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>
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
    </>
  );
};
