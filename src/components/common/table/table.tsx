import { VNode } from 'preact'; // AGREGADO
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
  getGroupedRowModel, // AGREGADO
  GroupingState, // AGREGADO
  Row,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'preact/hooks';
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
import { Group } from './components/group/group'; // Ya agregado antes
import { ROW_ACTIONS } from './enum';

export const Table = <T,>({
  data,
  columns,
  pageSize = 10,
  expandable,
  unsettings,
  visibility,
  onClickAction,
  unsearch,
}: ITableProps<T>) => {
  const columnsData = useMemo<ColumnDef<T>[]>(() => columns, [])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: pageSize })
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [grouping, setGrouping] = useState<GroupingState>([])
  const [columnOrder, setColumnOrder] = useState(() => columnsData.map((c) => c.id as string))
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

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
  })

  const memoizedLeafColumns = useMemo(() => {
    return table.getAllLeafColumns().map((column) => {
      const columnHeader = typeof column.columnDef.header !== "string" ? column.id : (column.columnDef.header as string)
      return { label: columnHeader, id: column.id }
    })
  }, [])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string)
        const newIndex = columnOrder.indexOf(over.id as string)
        return arrayMove(columnOrder, oldIndex, newIndex)
      })
    }
  }

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName.toLowerCase() === "span") {
      const id = target.dataset.id
      const type = target.dataset.type
      const action = target.dataset.action
      if (id && type && action) {
        onClickAction?.({ id, type, action: Number(action) as ROW_ACTIONS })
      }
    }
  }

  const buildSettings = () => (
    <div className="min-w-80 invisible absolute left-0 top-10 rounded-md p-4 bg-b-light dark:bg-b-dark border border-b-light-dark dark:border-b-dark-light">
      {table.getAllLeafColumns().map((column, index) => {
        const columnHeader =
          typeof column.columnDef.header !== "string" ? column.id : (column.columnDef.header as string)
        return (
          <div key={`${column.id}-${index}`} className="flex items-center space-x-2 py-1 flex-row">
            <div>
              {column.getCanPin() && (
                <span
                  className={`cursor-pointer vx-icon vx-icon-305 px-2 py-1 size-sm ${
                    column.getIsPinned() ? "text-error" : "text-primary"
                  }`}
                  onClick={() => column.pin(column.getIsPinned() ? false : "left")}
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
        )
      })}
    </div>
  )

  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  // Memoize the row rendering function to improve performance
  const renderRows = useCallback(
    (rows: Row<T>[]): VNode => {
      return (
        <>
          {rows.map((row) => {
            if (row.getIsGrouped()) {
              return (
                <Fragment key={row.id}>
                  <tr>
                    {!unsettings && (
                      <td className="text-center left-0 min-w-[30px]" style={{ position: "sticky", zIndex: 1 }}>
                        <span
                          onClick={() => row.toggleExpanded()}
                          className={`vox-icon ${
                            row.getIsExpanded() ? "vx-icon-002" : "vx-icon-001"
                          } cursor-pointer size-sm`}
                        />
                      </td>
                    )}
                    <td
                      colSpan={row.getVisibleCells().length + (!unsettings ? 0 : 0)}
                      className="p-2 bg-gray-200 font-semibold"
                    >
                      {row.groupingColumnId && (
                        <span>
                          {typeof row.columnFilters?.[0] === "string" ? "" : ""}
                          {row.getValue(row.groupingColumnId)} ({row.subRows.length})
                        </span>
                      )}
                    </td>
                  </tr>
                  {row.getIsExpanded() && row.subRows.length > 0 && renderRows(row.subRows)}
                </Fragment>
              )
            } else {
              return (
                <Fragment key={row.id}>
                  <tr>
                    {!unsettings && (
                      <td className="text-center left-0 min-w-[30px]" style={{ position: "sticky", zIndex: 1 }}>
                        {expandable && (
                          <span
                            onClick={() => row.toggleExpanded()}
                            className="vox-icon vx-icon-001 cursor-pointer size-sm"
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
                        <DraggableCell<T> key={`${cell.id}-${index}`} cell={cell} />
                      </SortableContext>
                    ))}
                  </tr>
                  {expandable && row.getIsExpanded() && (
                    <tr className="border-b border-gray-200">
                      <td colSpan={row.getVisibleCells().length + 1} className="p-4">
                        {expandable(row.original)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            }
          })}
        </>
      )
    },
    [expandable, unsettings],
  )

  // Memoize pagination buttons to improve performance
  const paginationButtons = useMemo(() => {
    if (data.length <= pageSize) return null

    return (
      <div className="flex flex-row items-center justify-center gap-2 p-3">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          type="button"
          name="prev"
          className="min-w-[100px] h-10 rounded-md bg-white border border-[#E5E7EB] text-[#6B7280]"
          label="PREV"
        />

        {Array.from({ length: Math.min(2, table.getPageCount()) }, (_, i) => i).map((page) => (
          <Button
            key={page}
            onClick={() => table.setPageIndex(page)}
            type="button"
            name={`page-${page + 1}`}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              table.getState().pagination.pageIndex === page
                ? "bg-[#E5F6F8] text-[#6B7280]"
                : "bg-white border border-[#E5E7EB] text-[#6B7280]"
            }`}
            label={(page + 1).toString()}
          />
        ))}

        {table.getPageCount() > 2 && (
          <Button
            onClick={() => {
              const middlePage = Math.floor(table.getPageCount() / 2)
              table.setPageIndex(middlePage)
            }}
            type="button"
            name="ellipsis"
            className="w-10 h-10 flex items-center justify-center rounded-md bg-white border border-[#E5E7EB] text-[#6B7280]"
            label="..."
          />
        )}

        {table.getPageCount() > 2 && (
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            type="button"
            name={`page-${table.getPageCount()}`}
            className={`w-10 h-10 flex items-center justify-center rounded-md ${
              table.getState().pagination.pageIndex === table.getPageCount() - 1
                ? "bg-[#E5F6F8] text-[#6B7280]"
                : "bg-white border border-[#E5E7EB] text-[#6B7280]"
            }`}
            label={table.getPageCount().toString()}
          />
        )}

        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          type="button"
          name="next"
          className="min-w-[100px] h-10 rounded-md bg-white border border-[#E5E7EB] text-[#6B7280]"
          label="NEXT"
        />
      </div>
    )
  }, [
    data.length,
    pageSize,
    table.getCanNextPage,
    table.getCanPreviousPage,
    table.getPageCount(),
    table.getState().pagination.pageIndex,
  ])

  return (
    <>
      <div className="relative w-full my-2 flex items-center justify-end">
        {!unsearch && (
          <Search id="search-general" name="search-general" keys={memoizedLeafColumns} onChange={setColumnFilters}  table={table}/>
        )}
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <div onClick={handleClick} className="">
          <table className="elements">
            <thead>
              {table.getHeaderGroups().map((headerGroup, index) => (
                <tr key={`${headerGroup.id}-${index}`} className="sticky top-0 z-20">
                  {!unsettings && (
                    <th
                      colSpan={1}
                      className="table-setting-button left-0 min-w-[30px]"
                      style={{ position: "sticky", zIndex: 1 }}
                    >
                      <span className="vox-icon vx-icon-168 size-sm" />
                      {buildSettings()}
                    </th>
                  )}
                  <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                    {headerGroup.headers.map((header, index) => (
                      <DraggableTableHeader<T> key={`${header.id}-${index}`} header={header} />
                    ))}
                  </SortableContext>
                </tr>
              ))}
            </thead>
            <tbody>{renderRows(table.getRowModel().rows)}</tbody>
          </table>
        </div>
      </DndContext>

      {paginationButtons}
    </>
  )
}

