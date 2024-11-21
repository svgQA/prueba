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
    zIndex: isPinned ? 1 : 0,
  };
};

export const Table = <T,>({
  data,
  columns,
  pageSize = 10,
  // expandable,
}: ITableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const openSettings = useSignal<boolean>(false);

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

  const memoizedLeafColumns = React.useMemo(() => {
    return table
      .getAllLeafColumns()
      .map((column) => String(column.columnDef.header) || column.id);
  }, [table]);

  return (
    <>
      {/* TABLE: HEADER */}
      <div className='w-full mb-2 flex flex-col items-end'>
        <Search
          id='search-general'
          name='search-general'
          keys={memoizedLeafColumns}
        />
      </div>

      {/* TABLE: ROWS */}
      {/* className='w-full h-[87vh] overflow-x-auto vox-scroll-design scroll-x-md mt-2' */}
      <div className='w-full rounded-xl border-2 border-b-light-dark dark:border-b-dark-light'>
        <table className='w-full border-collapse info'>
          <thead>
            {table.getHeaderGroups().map((headerGroup, index) => (
              <tr key={`${headerGroup.id}-${index}`} className='sticky top-0'>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={`${header.id}-${index}`}
                    colSpan={header.colSpan}
                    className='p-2 text-left font-semibold'
                    style={getCommonPinningStyles(header.column)}
                  >
                    <div className='flex justify-between items-center'>
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
                      {index === headerGroup.headers.length - 1 && (
                        <>
                          <span
                            className='px-2 vox-icon vx-icon-168 cursor-pointer size-sm'
                            onClick={() =>
                              (openSettings.value = !openSettings.value)
                            }
                          />
                          <div
                            className={`${openSettings.value ? 'visible' : 'invisible'} absolute right-2 top-12 rounded-lg shadow-lg p-4 z-30 bg-b-light border-2 dark:bg-b-dark border-b-light-dark dark:border-b-dark-light`}
                          >
                            <h5>Hidde or Pinned Columns</h5>
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
                                          column.pin(
                                            column.getIsPinned()
                                              ? false
                                              : 'left'
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                  <label className='flex items-center cursor-pointer'>
                                    <input
                                      {...{
                                        type: 'checkbox',
                                        checked: column.getIsVisible(),
                                        onChange:
                                          column.getToggleVisibilityHandler(),
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
                          </div>
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <React.Fragment key={`${row.id}_${index}`}>
                <tr className='h-14 hover:shadow'>
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
                {/* {expandable && row.getIsExpanded() && (
                  <tr className='border-b border-gray-200'>
                    <td colSpan={row.getVisibleCells().length} className='p-4'>
                      {expandable(row.original)}
                    </td>
                  </tr>
                )} */}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABLE: PAGINATION CONTROLS */}
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
