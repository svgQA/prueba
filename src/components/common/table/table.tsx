import { VNode } from 'preact';
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
  getGroupedRowModel,
  GroupingState,
  Row,
  // flexRender,
} from '@tanstack/react-table';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
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
// import { Button } from '../button/button';
import { Switch } from '../switch/switch';
// import { Group } from './components/group/group'; // Ya agregado antes
import { ROW_ACTIONS } from './enum';
import { Group } from './components/group';

export const Table = <T,>({
  data,
  columns,
  pageSize = 10,
  expandable,
  unsettings,
  visibility,
  onClickAction,
  unsearch,
  button,
}: ITableProps<T>) => {
  const columnsData = useMemo<ColumnDef<T>[]>(() => columns, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [columnOrder, setColumnOrder] = useState(() =>
    columnsData.map((c) => c.id as string)
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const table = useReactTable({
    data,
    columns: columnsData,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    state: {
      sorting,
      pagination,
      expanded,
      columnOrder,
      columnFilters,
      grouping,
    },
    onColumnOrderChange: setColumnOrder,
    initialState: {
      columnVisibility: visibility,
    },
  });

  const memoizedLeafColumns = useMemo(() => {
    return table.getAllLeafColumns().map((column) => {
      const columnHeader =
        typeof column.columnDef.header !== 'string'
          ? column.id
          : (column.columnDef.header as string);
      return { label: columnHeader, id: column.id };
    });
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
        onClickAction?.({ id, type, action: Number(action) as ROW_ACTIONS });
      }
    }
  };

  const buildSettings = () => (
    <div className='min-w-80 invisible absolute left-0 top-10 rounded-md p-4 bg-b-light dark:bg-b-dark border border-b-light-dark dark:border-b-dark-light'>
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
                  className={`cursor-pointer vx-icon vx-icon-305 px-2 py-1 size-sm ${
                    column.getIsPinned() ? 'text-error' : 'text-primary'
                  }`}
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

  const renderRows = useCallback(
    (rows: Row<T>[]): VNode => {
      return (
        <>
          {rows.map((row, rowIndex) => {
            const isLastRow = rowIndex === rows.length - 1;

            if (row.getIsGrouped()) {
              return (
                <Fragment key={row.id}>
                  <tr>
                    {!unsettings && (
                      <td
                        className='text-center left-0 min-w-[30px]'
                        style={{ position: 'sticky', zIndex: 1 }}
                      >
                        <span
                          onClick={() => row.toggleExpanded()}
                          className={`vox-icon ${
                            row.getIsExpanded() ? 'vx-icon-002' : 'vx-icon-001'
                          } cursor-pointer size-sm`}
                        />
                      </td>
                    )}
                    <td
                      colSpan={
                        row.getVisibleCells().length + (!unsettings ? 0 : 0)
                      }
                      className='p-2 bg-gray-200 font-semibold'
                    >
                      {row.groupingColumnId && (
                        <span>
                          {typeof row.columnFilters?.[0] === 'string' ? '' : ''}
                          {row.getValue(row.groupingColumnId)} (
                          {row.subRows.length})
                        </span>
                      )}
                    </td>
                  </tr>
                  {row.getIsExpanded() &&
                    row.subRows.length > 0 &&
                    renderRows(row.subRows)}
                </Fragment>
              );
            } else {
              return (
                <Fragment key={row.id}>
                  <tr
                    className={
                      data.length > pageSize && isLastRow
                        ? 'no-bottom-border'
                        : ''
                    }
                  >
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
              );
            }
          })}
        </>
      );
    },
    [expandable, unsettings, data.length, pageSize]
  );

  const renderPagination = () => {
    if (data.length <= pageSize) return null;

    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    const currentPageSize = table.getState().pagination.pageSize;

    const getIntermediatePages = (startIdx: number, endIdx: number) => {
      return Array.from(
        { length: endIdx - startIdx + 1 },
        (_, i) => startIdx + i
      );
    };

    let pageNumbers: (number | string)[] = [];

    if (totalPages <= 5) {
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      pageNumbers = [0];

      const firstEllipsisPages = getIntermediatePages(
        1,
        Math.min(currentPage - 1, totalPages - 2)
      );

      if (firstEllipsisPages.length === 1) {
        pageNumbers.push(firstEllipsisPages[0]);
      } else if (firstEllipsisPages.length > 1) {
        pageNumbers.push('ellipsis-start');
      }

      if (
        currentPage > 0 &&
        currentPage < totalPages - 1 &&
        !pageNumbers.includes(currentPage)
      ) {
        pageNumbers.push(currentPage);
      }

      const secondEllipsisPages = getIntermediatePages(
        Math.max(currentPage + 1, 1),
        totalPages - 2
      );

      if (secondEllipsisPages.length === 1) {
        pageNumbers.push(secondEllipsisPages[0]);
      } else if (secondEllipsisPages.length > 1) {
        pageNumbers.push('ellipsis-end');
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages - 1);
      }
    }

    return (
      <div className='flex items-center justify-between py-2 px-4'>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-600'>Filas por página:</span>
          <div className='relative'>
            <select
              value={currentPageSize}
              onChange={(e) => {
                const target = e.target as HTMLSelectElement;
                table.setPageSize(Number(target.value));
              }}
              className='h-8 appearance-none rounded border border-gray-300 bg-white pl-3 pr-8 text-sm'
              style={{ minWidth: '60px' }}
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='h-4 w-4 fill-current'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
          <span className='text-sm text-gray-600 ml-4'>
            {currentPage * currentPageSize + 1}-
            {Math.min((currentPage + 1) * currentPageSize, data.length)} de{' '}
            {data.length} elementos
          </span>
        </div>

        <div className='flex items-center'>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={`flex h-8 w-8 items-center justify-center rounded-sm border ${
              !table.getCanPreviousPage()
                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{'«'}</span>
          </button>

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`ml-1 flex h-8 w-8 items-center justify-center rounded-sm border ${
              !table.getCanPreviousPage()
                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{'‹'}</span>
          </button>

          {pageNumbers.map((pageIdx, i) =>
            pageIdx === 'ellipsis-start' || pageIdx === 'ellipsis-end' ? (
              <div
                key={`ellipsis-${i}`}
                className='relative'
                ref={activeDropdown === i ? dropdownRef : null}
              >
                <button
                  className='mx-1 flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 rounded-sm border border-gray-300'
                  onClick={() =>
                    setActiveDropdown(activeDropdown === i ? null : i)
                  }
                >
                  ...
                </button>

                {activeDropdown === i && (
                  <div className='absolute bottom-full left-0 mb-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-2 px-2 min-w-[120px]'>
                    <div className='grid grid-cols-3 gap-1'>
                      {(pageIdx === 'ellipsis-start'
                        ? getIntermediatePages(1, currentPage - 1).filter(
                            (num) => !pageNumbers.includes(num)
                          )
                        : getIntermediatePages(
                            currentPage + 1,
                            totalPages - 2
                          ).filter((num) => !pageNumbers.includes(num))
                      ).map((pageNum) => (
                        <button
                          key={`dropdown-page-${pageNum}`}
                          className='flex items-center justify-center h-8 w-8 rounded-sm hover:bg-gray-100 text-sm'
                          onClick={(e) => {
                            e.stopPropagation();
                            table.setPageIndex(pageNum);
                            setActiveDropdown(null);
                          }}
                        >
                          {pageNum + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                key={`page-${pageIdx}`}
                onClick={() => table.setPageIndex(Number(pageIdx))}
                className={`mx-1 flex h-8 w-8 items-center justify-center rounded-sm border ${
                  currentPage === pageIdx
                    ? 'border-[#00BCD4] bg-[#E0F7FA] text-[#00838F]'
                    : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {Number(pageIdx) + 1}
              </button>
            )
          )}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`ml-1 flex h-8 w-8 items-center justify-center rounded-sm border ${
              !table.getCanNextPage()
                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{'›'}</span>
          </button>

          <button
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            className={`ml-1 flex h-8 w-8 items-center justify-center rounded-sm border ${
              !table.getCanNextPage()
                ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{'»'}</span>
          </button>
        </div>

        <div className='text-sm text-gray-600 flex items-center gap-2'>
          <span>Página</span>
          <div className='inline-block border border-gray-300 bg-white rounded-sm px-3 py-1 min-w-[40px] text-center'>
            {currentPage + 1}
          </div>
          <span>de {totalPages}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='relative w-full my-2 flex items-center justify-end'>
        {button && <div className='mr-auto'>{button}</div>}
        {!unsearch && (
          <Search
            id='search-general'
            name='search-general'
            keys={memoizedLeafColumns}
            onChange={setColumnFilters}
            table={table}
            group={<Group<T> table={table} />}
          />
        )}
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div onClick={handleClick} className=''>
          <table className='elements'>
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
              {renderRows(table.getRowModel().rows)}
              {data.length > pageSize && (
                <tr className='pagination-row'>
                  <td
                    colSpan={
                      table.getAllColumns().length + (!unsettings ? 1 : 0)
                    }
                    className='p-0 border-t border-gray-200'
                  >
                    {renderPagination()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DndContext>
    </>
  );
};
