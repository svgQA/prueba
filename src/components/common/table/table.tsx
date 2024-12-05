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
import { Switch } from '../switch/switch';

export const Table = <T,>({
  data,
  columns,
  pageSize = 10,
  expandable,
  unscroll,
  unsettings,
  visibility,
  onClickAction,
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
    initialState: {
      columnVisibility: visibility,
    },
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

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName.toLowerCase() === 'span') {
      const id = target.dataset.id;
      const type = target.dataset.type;
      const action = target.dataset.action;
      if (id && type && action) {
        onClickAction?.({ id, type, action });
      }
    }
  };

  const buildSettings = () => (
    <div className='invisible absolute left-0 top-10 rounded-md p-4 bg-b-light dark:bg-b-dark border border-b-light-dark dark:border-b-dark-light'>
      {table.getAllLeafColumns().map((column, index) => {
        const columnHeader =
          typeof column.columnDef.header !== 'string'
            ? column.id
            : (column.columnDef.header as string);

        return (
          <div
            key={`${column.id}-${index}`}
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
            {}
            <Switch
              name={`ch-hidden-${column.id}`}
              id={`ch-hidden-${column.id}`}
              value={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
              label={columnHeader}
            />
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
      <div className='relative w-full mb-2 flex flex-col items-end'>
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
        <div
          className={`${unscroll ? 'overflow-y-hidden' : 'overflow-auto vox-scroll-design'} relative w-full rounded-xl border border-b-light-dark dark:border-b-dark-light scroll-x-md min-h-[50vh] max-h-[80vh]`}
          onClick={handleClick}
        >
          <table className='w-full border-collapse info'>
            <thead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <tr
                  key={`${headerGroup.id}-${index}`}
                  className='sticky top-0 z-20'
                >
                  {!unsettings && (
                    <th
                      colSpan={1}
                      className='table-setting-button left-0 min-w-[30px]'
                      style={{ position: 'sticky', zIndex: 1 }}
                    >
                      <span className='vox-icon vx-icon-168 size-sm' />
                      {buildSettings()}
                    </th>
                  )}
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header, index) => (
                      <DraggableTableHeader<T>
                        key={`${header.id}-${index}`}
                        header={header}
                      />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, index) => (
                <Fragment key={`${row.id}-${index}`}>
                  <tr>
                    {!unsettings && (
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
                    )}
                    {row.getVisibleCells().map((cell, index) => (
                      <SortableContext
                        key={`${cell.id}-${index}`}
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        <DraggableCell<T>
                          key={`${cell.id}-${index}`}
                          cell={cell}
                        />
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
            key={`${page}-${index}`}
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
