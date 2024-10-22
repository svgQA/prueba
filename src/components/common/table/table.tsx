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
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { useState } from 'preact/hooks';
import { ITableProps } from './interface';

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
    state: {
      sorting,
      pagination,
      expanded,
    },
  });

  return (
    <div>
      <table className='w-full my-2 border-collapse'>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className='bg-gray-50 border-b border-cyan-500'
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className='p-2 text-left font-semibold text-gray-600'
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
          {table.getRowModel().rows.map((row) => (
            <>
              <tr
                key={row.id}
                className='border-b border-gray-200 hover:bg-gray-50'
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className='p-2 whitespace-nowrap'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && (
                <tr className='bg-gray-100'>
                  <td colSpan={row.getVisibleCells().length} className='p-4'>
                    {/* Aquí podrías implementar una función para renderizar las filas expandidas según el tipo */}
                    <RowExpandedContent row={row} />
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className='flex justify-center items-center gap-2 mt-5'>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className='px-3 py-1 bg-[rgb(217,217,217)] text-gray-700 rounded'
        >
          PREV
        </button>
        {table.getPageOptions().map((page, index) => (
          <button
            key={index}
            onClick={() => table.setPageIndex(page)}
            className={`px-3 py-1 bg-[rgb(217,217,217)] text-gray-700 rounded ${
              table.getState().pagination.pageIndex === page ? 'font-bold' : ''
            }`}
          >
            {page + 1}
          </button>
        ))}
        {table.getPageCount() > 3 &&
        table.getState().pagination.pageIndex < table.getPageCount() - 3 ? (
          <span className='px-3 py-1 bg-[rgb(217,217,217)] text-gray-700 rounded'>
            ...
          </span>
        ) : null}
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className='px-3 py-1 bg-[rgb(217,217,217)] text-gray-700 rounded'
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

// Nuevo componente para manejar el contenido expandido
const RowExpandedContent = ({ row }: { row: any }) => {
  // Dependiendo de tus tipos, puedes verificar el tipo de fila aquí
  if (row.original.moreInfo) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white shadow rounded-lg'>
        {/* Columna de Descripción */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Descripción</h3>
          <p>{row.original.moreInfo}</p>
        </div>

        {/* Columna de Detalles */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Detalles</h3>
          <p>
            <strong>Supervisor:</strong> {row.original.supervisor}
          </p>
          <p>
            <strong>Turno relacionado:</strong> {row.original.relatedShift}
          </p>
          <p>
            <strong>Actualizado por:</strong> {row.original.updatedBy}
          </p>
          <p>
            <strong>Lugar:</strong> {row.original.location}
          </p>
        </div>

        {/* Columna de Cliente e Información */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Información del cliente</h3>
          <p>
            <strong>Cliente:</strong> {row.original.client}
          </p>
          <p>
            <strong>Ciudad:</strong> {row.original.city}
          </p>
          <p>
            <strong>Compañía:</strong> {row.original.company}
          </p>
          <p>
            <strong>Dirección:</strong> {row.original.address}
          </p>
        </div>

        {/* Columna del Mapa */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Mapa</h3>
          <img
            src={row.original.mapUrl}
            alt='Mapa de ubicación'
            className='w-full h-auto'
          />
        </div>

        {/* Columna de Archivos Adjuntos */}
        <div className='md:col-span-1'>
          <h3 className='font-semibold mb-2'>Archivos adjuntos</h3>
          <ul className='space-y-2'>
            {row.original.attachments &&
              row.original.attachments.map((attachment: any, index: number) => (
                <li key={index}>
                  <a
                    href={attachment.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center text-blue-600 hover:underline'
                  >
                    {attachment.type === 'image' && (
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className='w-8 h-8 mr-2 object-cover'
                      />
                    )}
                    {attachment.type === 'pdf' && (
                      <span className='mr-2'>📄</span>
                    )}
                    {attachment.type === 'audio' && (
                      <span className='mr-2'>🔊</span>
                    )}
                    {attachment.type === 'excel' && (
                      <span className='mr-2'>📊</span>
                    )}
                    {attachment.name}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  return <div>No data available for expansion</div>;
};
