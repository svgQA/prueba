import './assets/table.css';
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
import { ITableProps } from './interface';
import { RowExpandedContent } from './components';
import React from 'preact/compat';
import { Search } from '../search/search';

const getCommonPinningStyles = (column: Column<any>) => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    // opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  };
};

export const Table = <T,>({ data, columns, pageSize = 10 }: ITableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const table = useReactTable({
    columns,
    data,
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
    },
  });

  return (
    <div className='w-full h-full min-h-[60vh]'>
      {/* TABLE: HEADER */}
      <div className='w-96 mb-2'>
        <Search
          id='search-general'
          name='search-general'
          keys={table
            .getAllLeafColumns()
            .map((column) => String(column.columnDef.header) || column.id)}
          settings={
            <>
              {table.getAllLeafColumns().map((column) => {
                return (
                  <div
                    key={column.id}
                    className='flex items-center space-x-2 py-1 flex-row'
                  >
                    <div>
                      {column.getCanPin() && (
                        <span
                          className={`vx-icon vx-icon-305 px-2 py-1 size-sm ${column.getIsPinned() ? 'text-error' : 'text-primary'}`}
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
                      <span className='ml-2 text-sm'>
                        {column.columnDef.header}
                      </span>
                    </label>
                  </div>
                );
              })}
            </>
          }
        />
      </div>

      {/* TABLE: ROWS */}
      <div className=''>
        <table className='w-full'>
          <thead className='sticky top-0 z-20'>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <tr key={`${headerGroup.id}-${index}`}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={`${header.id}-${index}`}
                    colSpan={header.colSpan}
                    className='p-2 text-left font-semibold'
                    style={getCommonPinningStyles(header.column)}
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <React.Fragment key={`${row.id}_${index}`}>
                <tr>
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={`${cell.id}_${index}`}
                      style={getCommonPinningStyles(cell.column)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    <td colSpan={row.getVisibleCells().length} className='p-4'>
                      <RowExpandedContent row={row} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLE: PAGINATION CONTROLS */}
      <div className='sticky w-fit flex justify-center gap-1 bottom-2 right-0 p-2 border-2 rounded-md shadow-sm z-10 bg-b-light dark:bg-b-dark border-b-light-dark dark:border-b-dark-light'>
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
    </div>
  );
};
