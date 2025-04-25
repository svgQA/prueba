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
  FilterFn,
  flexRender,
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
import { DraggableCell } from './components';
import { Fragment } from 'preact/jsx-runtime';
import { Switch } from '../switch/switch';
import { ROW_ACTIONS } from './enum';
import { Group } from './components/group';
import { useSignal } from '@preact/signals';

export const Table = <T,>({
  data,
  columns = [],
  pageSize = 10,
  expandable,
  unsettings,
  visibility,
  onClickAction,
  unsearch,
  button,
  showExpandableIcon = true,
  selectable,
  onSelectionChange,
  onNotifications,
}: ITableProps<T>) => {
  const defaultOrFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);

    if (Array.isArray(filterValue)) {
      return filterValue.some((val) =>
        String(rowValue).toLowerCase().includes(String(val).toLowerCase())
      );
    }
    return String(rowValue)
      .toLowerCase()
      .includes(String(filterValue).toLowerCase());
  };

  const columnsData = useMemo<ColumnDef<T>[]>(() => {
    return columns.map((column) => ({
      ...column,
      filterFn: defaultOrFilterFn,
    }));
  }, []);
  const [selectedRows, setSelectedRows] = useState<Record<string, T>>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const currentColumnName = useSignal<string>('');

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

  /*
  const extendedColumns = useMemo(() => {
    if (!selectable) return columnsData;

    return [
      {
        id: 'select',
        header: () => {
          const allSelected = data.length > 0 && Object.keys(selectedRows).length === data.length;
          const noneSelected = Object.keys(selectedRows).length === 0;

          return (
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={allSelected}
                indeterminate={!noneSelected && !allSelected} // esto lo maneja nativo si usas React, aquí no aplica directamente
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  const newSelection = checked
                    ? Object.fromEntries(data.map((row: any) => [row.id, row]))
                    : {};
                  setSelectedRows(newSelection);
                  onSelectionChange?.(Object.values(newSelection));
                }}
              />
              <span className="text-sm font-medium text-gray-700">
                {allSelected ? 'Limpiar selección' : 'Notificar'}
              </span>
            </label>
          );
        },

        cell: ({ row }: { row: Row<T> }) => {
          // const id = (row.original as any).id;
          return (
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={!!selectedRows[(row.original as any).id]}
              onChange={(e) => {
                const id = (row.original as any).id;
                const updated = { ...selectedRows };
                if (e.currentTarget.checked) {
                  updated[id] = row.original;
                } else {
                  delete updated[id];
                }
                setSelectedRows(updated);
                onSelectionChange?.(Object.values(updated));
              }}
            />
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      ...columnsData, // ← columnas originales van después del checkbox
    ];
  }, [selectable, data, selectedRows]);
  */

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
    filterFns: {
      defaultOrFilterFn,
    },
    globalFilterFn: defaultOrFilterFn,
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
    e.stopPropagation();
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
    // bg-b-light dark:bg-b-dark border border-b-light-dark dark:border-b-dark-light
    <div className='min-w-80 invisible absolute left-0 top-10 rounded-md p-4 bg-b-content border-2 border-gray-100 dark:border-b-dark-light'>
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
              const selectableGroupItems = row.subRows
                .map((r) => r.original as any)
                .filter((item) => item?.employee?.playerId);

              const selectableGroupIds = selectableGroupItems.map(
                (item) => item.id
              );

              const allGroupSelected =
                selectableGroupIds.length > 0 &&
                selectableGroupIds.every((id) => selectedRows[id]);

              const someGroupSelected =
                selectableGroupIds.some((id) => selectedRows[id]) &&
                !allGroupSelected;

              return (
                <Fragment key={row.id}>
                  <tr className='odd:bg-gray-100 dark:odd:bg-gray-800'>
                    {!unsettings && (
                      <td className='text-center left-0 min-w-[30px]'>
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
                        row.getVisibleCells().length + (!unsettings ? 1 : 0)
                      }
                      className='p-2 font-semibold'
                    >
                      <div className='flex justify-between items-center w-full'>
                        <span>
                          {row.groupingColumnId && (
                            <>
                              {row.getValue(row.groupingColumnId)} (
                              {row.subRows.length})
                            </>
                          )}
                        </span>

                        {selectable &&
                          onNotifications &&
                          row.subRows.some(
                            (sub) => !!(sub.original as any).employee?.playerId
                          ) && (
                            <label className='inline-flex items-center gap-2'>
                              <input
                                type='checkbox'
                                className='w-4 h-4'
                                checked={allGroupSelected}
                                ref={(el) => {
                                  if (el) el.indeterminate = someGroupSelected;
                                }}
                                onChange={(e) => {
                                  const isChecked = e.currentTarget.checked;
                                  const updated = { ...selectedRows };

                                  row.subRows.forEach((subRow) => {
                                    const data = subRow.original as any;
                                    if (data.employee?.playerId) {
                                      const id = data.id;
                                      if (isChecked) {
                                        updated[id] = data;
                                      } else {
                                        delete updated[id];
                                      }
                                    }
                                  });

                                  setSelectedRows(updated);
                                  onSelectionChange?.(Object.values(updated));
                                }}
                              />
                              <span className='text-sm text-gray-700'>
                                {allGroupSelected
                                  ? 'Deseleccionar'
                                  : 'Seleccionar todas'}
                              </span>
                            </label>
                          )}
                      </div>
                    </td>
                  </tr>

                  {/* {row.getIsExpanded() &&
                    row.subRows.length > 0 &&
                    renderRows(row.subRows)} */}

                  {row.getIsExpanded() && !row.parentId && row.subRows.map((subRow) => (
                    <tr key={subRow.id} className='odd:bg-gray-100 dark:odd:bg-gray-800'>
                      {!unsettings && <td className='left-0 min-w-[30px]'></td>}
                      {subRow.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              );
            } else if (!row.parentId) {
            // } else {
              return (
                <Fragment key={row.id}>
                  <tr
                    className={`odd:bg-gray-100 dark:odd:bg-gray-800 ${
                      data.length > pageSize && isLastRow
                        ? 'no-bottom-border'
                        : ''
                    }`}
                  >
                    {!unsettings && (
                      <td
                        className='left-0 min-w-[30px] bg-gray-100 dark:bg-gray-700'
                        // style={{ position: 'sticky', zIndex: 1 }}
                      >
                        {expandable && showExpandableIcon && (
                          <span
                            onClick={() => row.toggleExpanded()}
                            className='vox-icon vx-icon-001 cursor-pointer size-sm'
                          />
                        )}
                        {selectable &&
                          onNotifications &&
                          (row.original as any).employee?.playerId && (
                            <div className='flex items-center justify-center'>
                              <input
                                type='checkbox'
                                className='w-4 h-4'
                                checked={
                                  !!selectedRows[(row.original as any).id]
                                }
                                onChange={(e) => {
                                  e.preventDefault();
                                  const data = row.original as any;
                                  const id = data.id;
                                  const updated = { ...selectedRows };

                                  if (e.currentTarget.checked) {
                                    updated[id] = data;
                                  } else {
                                    delete updated[id];
                                  }

                                  setSelectedRows(updated);
                                  onSelectionChange?.(Object.values(updated));
                                }}
                              />
                            </div>
                          )}
                      </td>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <SortableContext
                        key={`sortable-${row.id}-${cell.id}`}
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        <DraggableCell<T>
                          key={`cell-${row.id}-${cell.id}`}
                          onCurrentColumnName={(value) => {
                            currentColumnName.value = value;
                          }}
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
                        {expandable(row.original, currentColumnName.value)}
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
    [expandable, unsettings, data.length, pageSize, selectedRows]
  );

  const renderPagination = () => {
    // if (data.length <= pageSize) return null;

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
      <div className='flex items-center justify-between py-2 px-4 rounded-lg'>
        <div className='flex items-center gap-2'>
          <span>Filas por página:</span>
          <div className='relative'>
            <select
              value={currentPageSize}
              onChange={(e) => {
                const target = e.target as HTMLSelectElement;
                table.setPageSize(Number(target.value));
              }}
              className='h-8 appearance-none rounded pl-3 pr-8 text-sm'
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
              <span className='vox-icon vx-icon-001 !text-sm'></span>
            </div>
          </div>
          <span>
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
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>{'«'}</span>
          </button>

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`ml-1 flex h-8 w-8 items-center justify-center rounded-sm border ${
              !table.getCanPreviousPage()
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                  className='mx-1 flex h-8 w-8 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  onClick={() =>
                    setActiveDropdown(activeDropdown === i ? null : i)
                  }
                >
                  ...
                </button>

                {activeDropdown === i && (
                  <div className='absolute bottom-full left-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-2 px-2 min-w-[120px]'>
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
                          className='flex items-center justify-center h-8 w-8 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-300'
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
                    ? 'border-[#00BCD4] dark:border-[#006064] bg-[#E0F7FA] dark:bg-[#006064] text-[#00838F] dark:text-[#B2EBF2]'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>{'›'}</span>
          </button>

          <button
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            className={`ml-1 flex h-8 w-8 items-center justify-center rounded-sm border ${
              !table.getCanNextPage()
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span>{'»'}</span>
          </button>
        </div>

        <div className='text-sm text-gray-600 flex items-center gap-2'>
          <span>Página</span>
          <div className='inline-block border border-gray-300 bg-white dark:border-gray-700 dark:text-white dark:bg-gray-800 rounded-sm px-3 py-1 min-w-[40px] text-center'>
            {currentPage + 1}
          </div>
          <span>de {totalPages}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className='relative w-full py-1 flex items-center justify-end'>
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
        <div
          onClick={handleClick}
          className='min-h-[30vh] border-2 border-gray-100 dark:border-b-dark-light rounded-lg !overflow-x-auto vox-scroll-design'
        >
          <table className='elements'>
            <thead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <tr
                  key={`${headerGroup.id}-${index}`}
                  className='sticky top-0 z-10'
                >
                  {!unsettings && (
                    <th
                      colSpan={1}
                      className='table-setting-button left-0 min-w-[30px] bg-white px-2'
                      style={{ position: 'sticky', zIndex: 1 }}
                    >
                      <div className='flex items-center gap-2 relative'>
                        {selectable &&
                          onNotifications &&
                          data.some((row: any) => !!row.employee?.playerId) && (
                            <input
                              type='checkbox'
                              className='w-4 h-4'
                              checked={
                                Object.keys(selectedRows).length === data.length
                              }
                              ref={(el) => {
                                if (el) {
                                  const all =
                                    data.length > 0 &&
                                    Object.keys(selectedRows).length ===
                                      data.length;
                                  const none =
                                    Object.keys(selectedRows).length === 0;
                                  el.indeterminate = !all && !none;
                                }
                              }}
                              onChange={(e) => {
                                const checked = e.currentTarget.checked;
                                const newSelection = checked
                                  ? Object.fromEntries(
                                      data.map((row: any) => [row.id, row])
                                    )
                                  : {};
                                setSelectedRows(newSelection);
                                onSelectionChange?.(
                                  Object.values(newSelection)
                                );
                              }}
                            />
                          )}
                        <div className='relative'>
                          <span
                            className='vox-icon vx-icon-168 size-sm cursor-pointer'
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(
                                activeDropdown === -1 ? null : -1
                              );
                            }}
                          />
                          {activeDropdown === -1 && (
                            <div
                              ref={dropdownRef}
                              className='absolute -left-3 -mt-10 z-50'
                            >
                              {buildSettings()}
                            </div>
                          )}
                        </div>
                      </div>
                    </th>
                  )}

                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className='px-2 py-1 text-left bg-white sticky top-0 z-10'
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>

            <tbody>
              {renderRows(table.getRowModel().rows)}
              <tr>
                <td
                  colSpan={table.getAllColumns().length + (!unsettings ? 1 : 0)}
                >
                  {renderPagination()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DndContext>
    </>
  );
};
