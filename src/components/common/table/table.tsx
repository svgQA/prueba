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
import { type ITableProps } from './interface';
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
// import { ROW_ACTIONS } from './enum';
import { Group } from './components/group';
import { useSignal } from '@preact/signals';
import { Button } from '../button/button';
import { DraggableTableHeader } from './components/draggable.header';
import { ROW_ACTIONS } from './enum';

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
  showExpandableIcon = false,
  selectable,
  onSelectionChange,
  hasNotifications = false,
  onNotifications,
  isSettingTable = false,
}: ITableProps<T>) => {
  const [selectedCells, setSelectedCells] = useState<Record<string, string>>(
    {}
  );
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
  // const currentColumnName = useSignal<string>('');

  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [columnOrder, setColumnOrder] = useState(() =>
    columnsData.map((c) => c.id as string)
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const isSettingOpen = useSignal(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSettingToggle = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    isSettingOpen.value = !isSettingOpen.value;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        isSettingOpen.value = false;
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
    // TODO: No descomentar esto, dejar asi.
    // e.stopPropagation();
    // e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.tagName === 'SPAN') {
      const id = target.dataset.id;
      const type = target.dataset.type;
      const action = target.dataset.action;
      const rowId = target.dataset.rowId;
      const clickable = target.dataset.clickable;

      if (id && type && action && rowId && clickable) {
        const row = table.getRow(rowId);
        if (!row) return;
        /**
         * @description
         * Si el id de la celda seleccionada es el mismo que el id de la celda actual, se expande la fila.
         * Si la fila no está expandida, se expande la fila.
         * Si la fila está expandida, se elimina el id de la celda seleccionada.
         *
         * i_e = true Y i_s = true => row.toggleExpanded(false)
         * i_e = true Y i_s = false => row.toggleExpanded(true)
         * i_e = false Y i_s = true => row.toggleExpanded(true)
         * i_e = false Y i_s = false => row.toggleExpanded(true)
         */
        const isExpanded /* i_e */ = row.getIsExpanded();
        const isSelected /* i_s */ = selectedCells[rowId] === id;

        if (isExpanded && isSelected) {
          row.toggleExpanded(false);
          // Eliminar la selección de esta fila cuando se cierra el expanded
          setSelectedCells((prev) => {
            const { [rowId]: _, ...rest } = prev;
            return rest;
          });
        } else if (isExpanded && !isSelected) {
          // Solo actualizar la celda seleccionada sin cambiar el estado de expansión
          setSelectedCells((prev) => ({
            ...prev,
            [rowId]: id,
          }));
        } else if (!isExpanded && isSelected) {
          row.toggleExpanded(true);
        } else if (!isExpanded && !isSelected) {
          row.toggleExpanded(true);
        }

        // Solo actualizar la selección si no estamos cerrando el expanded
        if (!(isExpanded && isSelected)) {
          setSelectedCells((prev) => ({
            ...prev,
            [rowId]: id,
          }));
        }
      }

      // TODO: Esta validacion va a morir porque todo va a cambiar al dropdown
      // de acciones de las columnas. Lo cual me parece una mierda por performance.
      // Por ahora se deja aquí porque algunas columnas de settings no tienen dropdown
      if (id && type && action) {
        onClickAction?.({ id, type, action: Number(action) as ROW_ACTIONS });
      }
    }
  };

  const buildSettings = () => (
    <div className='min-w-80 rounded-b-md p-4 bg-b-light-light dark:bg-b-dark-dark border-2 border-gray-100 dark:border-gray-700 rounded-md max-h-container-table overflow-y-auto vox-scroll-design'>
      {table.getAllLeafColumns().map((column, index) => {
        if (['id', 'actions'].includes(column.id)) return null;
        const columnHeader =
          typeof column.columnDef.header !== 'string'
            ? column.id
            : (column.columnDef.header as string);
        return (
          <div
            key={`${column.id}-${index}`}
            className='flex items-center space-x-2 py-1 flex-row gap-2'
          >
            {column.getCanPin() && (
              <Button
                name={`btn-pin-${column.id}`}
                icon='030'
                iconSize='sm'
                selectedColor='bg-ternary'
                selected={!!column.getIsPinned()}
                onClick={() =>
                  column.pin(column.getIsPinned() ? false : 'left')
                }
                square
              />
            )}

            <Switch
              id={`ch-hidden-${column.id}`}
              name={`ch-hidden-${column.id}`}
              label={columnHeader}
              value={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
              backgroundColor='bg-b-content dark:bg-b-dark-light'
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
            const hasRowsNotifications = (row.original as any)
              ?.hasNotifications;
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
                  <tr>
                    {!unsettings && (
                      <td className='text-center left-0 min-w-[30px]'>
                        <span
                          // TODO: Toggle expandable row
                          // onClick={() => {
                          //   row.toggleExpanded()
                          // }}
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
                        {/* <span>
                          {row.groupingColumnId && (
                            <>
                              {row.getValue(row.groupingColumnId)} (
                              {row.subRows.length})
                            </>
                          )}
                        </span> */}

                        <span>
                          {(() => {
                            const groupingColumn = table
                              .getAllLeafColumns()
                              .find((col) => col.id === row.groupingColumnId);
                            const getIconGroup = (
                              groupingColumn?.columnDef as any
                            ).getIconGroup;
                            const iconData = getIconGroup
                              ? getIconGroup(row.original)
                              : undefined;
                            const iconGroup = iconData?.icon;
                            const colorIconGroup = iconData?.color;
                            return iconGroup ? (
                              <span
                                className={`vx-icon vx-icon-${iconGroup} size-md mt-3 ${colorIconGroup ?? ''}`}
                              />
                            ) : null;
                          })()}
                          <span className='ml-2'>
                            {row.groupingColumnId
                              ? `${row.getValue(row.groupingColumnId)} (${row.subRows.length})`
                              : `(${row.subRows.length})`}
                          </span>
                        </span>

                        {selectable &&
                          onNotifications &&
                          hasRowsNotifications && (
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

                  {row.getIsExpanded() &&
                    !row.parentId &&
                    row.subRows.map((subRow) => (
                      <tr key={subRow.id}>
                        {!unsettings && (
                          <td className='left-0 min-w-[30px]'></td>
                        )}
                        {subRow.getVisibleCells().map((cell) => (
                          <td key={cell.id} className='px-1'>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                </Fragment>
              );
            } else if (!row.parentId) {
              return (
                <Fragment key={row.id}>
                  <tr
                    className={`text-t-light dark:text-t-dark ${
                      data.length > pageSize && isLastRow
                        ? 'no-bottom-border'
                        : ''
                    }`}
                  >
                    {!unsettings && (
                      <td
                        className='left-0 bg-b-light dark:bg-b-dark'
                        style={{ position: 'sticky', zIndex: 1 }}
                      >
                        {expandable && showExpandableIcon && (
                          <div className='flex items-center justify-center h-full max-w-[2.5rem]'>
                            <span
                              // TODO: Toggle expandable row (POSIBLE VOLVER A PONER)
                              onClick={() => row.toggleExpanded()}
                              className='vx-icon vx-icon-001 cursor-pointer size-sm'
                            />
                          </div>
                        )}
                        {selectable &&
                          onNotifications &&
                          hasRowsNotifications && (
                            <div className='flex items-center justify-center h-full max-w-[2.5rem]'>
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
                          cell={cell}
                          rowId={row.id}
                          selected={cell.column.id === selectedCells[row.id]}
                        />
                      </SortableContext>
                    ))}
                  </tr>
                  {expandable && row.getIsExpanded() && (
                    <tr>
                      <td
                        colSpan={row.getVisibleCells().length + 1}
                        className='p-2'
                      >
                        {expandable &&
                          expandable(row.original, selectedCells[row.id])}
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
    [
      expandable,
      unsettings,
      data.length,
      pageSize,
      selectedRows,
      hasNotifications,
      onNotifications,
      selectedCells,
    ]
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

        <div className='flex items-center gap-1'>
          <Button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            name='first-page'
            icon='285'
            square
          />
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            name='previous-page'
            icon='003'
            square
          />
          {pageNumbers.map((pageIdx, i) =>
            pageIdx === 'ellipsis-start' || pageIdx === 'ellipsis-end' ? (
              <div
                key={`ellipsis-${i}`}
                className='relative'
                // ref={activeDropdown === i ? dropdownRef : null}
              >
                <Button
                  onClick={() =>
                    setActiveDropdown(activeDropdown === i ? null : i)
                  }
                  name='ellipsis'
                  icon='429'
                  square
                />
                {activeDropdown === i && (
                  <div className='absolute bottom-full left-0 mb-1 bg-white dark:bg-b-dark-dark border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-2 px-2 min-w-[120px]'>
                    <div className='grid grid-cols-3 gap-2'>
                      {(pageIdx === 'ellipsis-start'
                        ? getIntermediatePages(1, currentPage - 1).filter(
                            (num) => !pageNumbers.includes(num)
                          )
                        : getIntermediatePages(
                            currentPage + 1,
                            totalPages - 2
                          ).filter((num) => !pageNumbers.includes(num))
                      ).map((pageNum) => (
                        <Button
                          key={`dropdown-page-${pageNum}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            table.setPageIndex(pageNum);
                            setActiveDropdown(null);
                          }}
                          name='page'
                          square
                          label={`${pageNum + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button
                key={`page-${pageIdx}`}
                onClick={() => table.setPageIndex(Number(pageIdx))}
                name='page'
                unpadded
                square
                selectedColor='dark:bg-ternary bg-primary'
                selected={currentPage === pageIdx}
                label={`${Number(pageIdx) + 1}`}
              />
            )
          )}

          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            name='next-page'
            icon='004'
            square
          />
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            name='previous-page'
            icon='286'
            square
          />
        </div>

        <div className='text-sm flex items-center gap-2 px-2'>
          Página
          <div className='inline-block border rounded-md px-3 py-1 min-w-[40px] text-center border-b-light-dark dark:border-b-darkt'>
            {currentPage + 1}
          </div>
          de {totalPages}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* sticky top-[3.4rem] z-[8] */}
      <div className='w-full py-1 pb-3 flex items-center justify-end'>
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
          className='pb-12 min-h-[30vh] border-2 border-gray-200 dark:border-b-dark-light rounded-lg relative'
        >
          <div
            className={`${
              isSettingTable ? 'max-h-setting-table' : 'max-h-general-table'
            } overflow-y-auto relative overflow-x-auto vox-scroll-design`}
          >
            <table className='elements relative'>
              <thead>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <tr
                    key={`${headerGroup.id}-${index}`}
                    className='sticky top-0 z-10'
                  >
                    <th
                      colSpan={1}
                      style={{
                        position: 'sticky',
                        left: '0',
                        zIndex: 1,
                      }}
                      className='!max-w-[2.5rem]'
                    >
                      {selectable && onNotifications && hasNotifications && (
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
                            onSelectionChange?.(Object.values(newSelection));
                          }}
                        />
                      )}
                      {!unsettings && !onNotifications && (
                        <div className='flex items-center gap-2 relative w-full px-1 z-20'>
                          <Button
                            name='setting'
                            icon='168'
                            square
                            onClick={handleSettingToggle}
                          />
                          <div
                            ref={dropdownRef}
                            className={`absolute left-1 top-11 transition-opacity duration-200 ${
                              isSettingOpen.value
                                ? 'opacity-100 visible'
                                : 'opacity-0 invisible'
                            }`}
                          >
                            {buildSettings()}
                          </div>
                        </div>
                      )}
                    </th>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableTableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </tr>
                ))}
              </thead>

              <tbody>{renderRows(table.getRowModel().rows)}</tbody>
            </table>
          </div>
          <div className='pagination-row'>{renderPagination()}</div>
        </div>
      </DndContext>
    </>
  );
};
