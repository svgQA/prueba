import './table.css';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  ExpandedState,
  getExpandedRowModel,
  ColumnDef,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'preact/hooks';
import { ITableProps } from './interface';
import { Search } from '../search/search';
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
} from '@dnd-kit/sortable';
import { DraggableCell, DraggableTableHeader } from './components';
import { Fragment } from 'preact/jsx-runtime';
import { Button } from '../button/button';

export const Table = <T,>({
  data,
  columns,
  pageSize = 10,
  expandable,
}: ITableProps<T>) => {
  const columnsData = useMemo<ColumnDef<T>[]>(() => columns, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [columnOrder, setColumnOrder] = useState(() =>
    columnsData.map((c) => c.id as string)
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: columnsData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      pagination,
      expanded,
      columnOrder,
      columnFilters,
    },
    onColumnOrderChange: setColumnOrder,
  });

  const memoizedLeafColumns = useMemo(() => {
    return table.getAllLeafColumns().map((column) => ({
      label: String(column.columnDef.header),
      id: column.id,
    }));
  }, []);

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

  const buildSettings = () => (
    <div className='invisible absolute left-1 top-10 rounded-md p-4 z-30 bg-b-light dark:bg-b-dark border-2 border-b-light-dark dark:border-b-dark-light'>
      {table.getAllLeafColumns().map((column) => {
        return (
          <div
            key={column.id}
            className='flex items-center space-x-2 py-1 flex-row'
          >
            <div>
              {column.getCanPin() && (
                <span
                  className={`cursor-pointer vx-icon vx-icon-305 px-2 py-1 size-sm ${column.getIsPinned() ? 'text-error' : 'text-primary'}`}
                  onClick={() =>
                    column.pin(column.getIsPinned() ? false : 'left')
                  }
                />
              )}
            </div>
            <label className='flex items-center cursor-pointer'>
              <input
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
                className='form-checkbox h-4 w-4 rounded'
              />
              <span className='ml-2 text-sm'>{column.columnDef.header}</span>
            </label>
          </div>
        );
      })}
    </div>
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  return (
    <>
      <div className='w-full mb-2 flex flex-col items-end'>
        <Search
          id='search-general'
          name='search-general'
          keys={memoizedLeafColumns}
          onChange={setColumnFilters}
        />
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div className='relative w-full rounded-xl border-2 border-b-light-dark dark:border-b-dark-light scroll-x-md overflow-x-auto vox-scroll-design max-h-[80vh]'>
          <table className='w-full border-collapse info'>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className='sticky top-0 z-20'>
                  <th
                    colSpan={1}
                    className='table-setting-button left-0 min-w-[30px]'
                    style={{ position: 'sticky', zIndex: 1 }}
                  >
                    <span className='vox-icon vx-icon-168 size-sm' />
                    {buildSettings()}
                  </th>
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader<T>
                        key={header.id}
                        header={header}
                      />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <Fragment key={`${row.id}_${index}`}>
                  <tr>
                    <td
                      className='text-center left-0 min-w-[30px]'
                      style={{ position: 'sticky', zIndex: 1 }}
                    >
                      {expandable && (
                        <span
                          onClick={() => row.toggleExpanded()}
                          className='vox-icon vx-icon-001 cursor-pointer size-sm'
                        />
                      )}
                    </td>
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
                  {expandable && row.getIsExpanded() && (
                    <tr className='border-b border-gray-200'>
                      <td
                        colSpan={row.getVisibleCells().length + 1}
                        className='p-4'
                      >
                        {expandable(row.original)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </DndContext>
      <div className='flex flex-row gap-3 justify-end p-3'>
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          type='button'
          label='back'
          icon='123'
          name='back'
        />
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
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          type='button'
          label='next'
          icon='123'
          name='next'
        />
      </div>
    </>
  );
};
