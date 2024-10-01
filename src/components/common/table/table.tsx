import './table.css';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'preact/hooks';
import { ITableProps, ITableSearchProps } from './interface';

const TableSearch = ({
  globalFilter,
  setGlobalFilter,
  placeholder,
}: ITableSearchProps) => (
  <input
    value={globalFilter ?? ''}
    onChange={(e) => setGlobalFilter(e.currentTarget.value)}
    className='p-2 font-lg shadow border border-block'
    placeholder={placeholder}
  />
);

export const Table = <T,>({
  data,
  columns,
  search,
  searchPlaceholder = 'Buscar...',
  pageSize = 10,
}: ITableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
  });

  return (
    <div>
      {search ? (
        search
      ) : (
        <TableSearch
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          placeholder={searchPlaceholder}
        />
      )}
      <table className='w-full my-2'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
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
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='flex flex-row justify-between items-center gap-2 mt-5 w-full'>
        <div>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
        </div>
        <span className='flex items-center gap-1'>
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number((e.target as HTMLSelectElement).value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
// import './table.css';
// import {
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   PaginationState,
//   useReactTable,
// } from '@tanstack/react-table';
// import { useState } from 'preact/hooks';
// import { ITableProps } from './interface';

// export const Table = <T,>({ data, columns, search }: ITableProps<T>) => {
//   const [pagination, setPagination] = useState<PaginationState>({
//     pageIndex: 0,
//     pageSize: 10,
//   });

//   const table = useReactTable({
//     columns,
//     data,
//     debugTable: true,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onPaginationChange: setPagination,
//     state: {
//       pagination,
//     },
//   });

//   return (
//     <div>
//       {search}
//       <table className='w-full my-2'>
//         <thead>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <tr key={headerGroup.id}>
//               {headerGroup.headers.map((header) => {
//                 return (
//                   <th key={header.id} colSpan={header.colSpan}>
//                     <div
//                     // className={
//                     //   header.column.getCanSort()
//                     //     ? 'cursor-pointer select-none'
//                     //     : ''
//                     // }
//                     // onClick={header.column.getToggleSortingHandler()}
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext()
//                       )}
//                       {/*
//                       {{
//                         asc: ' 🔼',
//                         desc: ' 🔽',
//                       }[header.column.getIsSorted() as string] ?? null}
//                       {header.column.getCanFilter() ? (
//                         <div>
//                           <Filter column={header.column} table={table} />
//                         </div>
//                       ) : null}
//                       */}
//                     </div>
//                   </th>
//                 );
//               })}
//             </tr>
//           ))}
//         </thead>
//         <tbody>
//           {table.getRowModel().rows.map((row) => {
//             return (
//               <tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => {
//                   return (
//                     <td key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </td>
//                   );
//                 })}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <div className='flex flex-row justify-center items-center gap-2 mt-5 w-full'>
//         <button
//           onClick={() => table.firstPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           {'<<'}
//         </button>
//         <button
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           {'<'}
//         </button>
//         <button
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           {'>'}
//         </button>
//         <button
//           onClick={() => table.lastPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           {'>>'}
//         </button>
//         <span className='flex items-center gap-1'>
//           <div>Page</div>
//           <strong>
//             {table.getState().pagination.pageIndex + 1} of{' '}
//             {table.getPageCount().toLocaleString()}
//           </strong>
//         </span>
//         {/*
//         <span className='flex items-center gap-1'>
//           | Go to page:
//           <input
//             type='number'
//             min='1'
//             max={table.getPageCount()}
//             // defaultValue={table.getState().pagination.pageIndex + 1}
//             onChange={(e) => {
//               // @ts-ignore
//               const value = e?.target?.value;
//               const page = value ? Number(value) - 1 : 0;
//               table.setPageIndex(page);
//             }}
//             className='border p-1 rounded w-16'
//           />
//         </span>
//         <select
//           value={table.getState().pagination.pageSize}
//           onChange={(e) => {
//             // @ts-ignore
//             table.setPageSize(Number(e?.target?.value));
//           }}
//         >
//           {[10, 20, 30, 40, 50].map((pageSize) => (
//             <option key={pageSize} value={pageSize}>
//               Show {pageSize}
//             </option>
//           ))}
//         </select>
//         */}
//       </div>
//       {/*
//       <div>
//         Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
//         {table.getRowCount().toLocaleString()} Rows
//       </div>
//       <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
//       */}
//     </div>
//   );
// };
