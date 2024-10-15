import { type FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { memosData } from './memos.data';
import { Memo } from './memos.d';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/common/table/table';
import { ProgressBar, InfoIcon } from './memos.columns';

export const MemosPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Memos Service';
  }, []);

  const columns = useMemo<ColumnDef<Memo>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'Nombres',
      },
      {
        accessorKey: 'lastName',
        header: 'Apellidos',
      },
      {
        accessorKey: 'age',
        header: 'Edad',
      },
      {
        accessorKey: 'visits',
        header: 'Visitas',
      },
      {
        accessorKey: 'status',
        header: 'Estado',
      },
      {
        accessorKey: 'progress',
        header: 'Progreso',
        cell: (info) => <ProgressBar progress={info.getValue() as number} />,
      },
      {
        id: 'expand',
        header: 'Más información',
        cell: ({ row }) => (
          <InfoIcon
            onClick={() => row.toggleExpanded()}
            isExpanded={row.getIsExpanded()}
          />
        ),
      },
    ],
    []
  );

  const renderExpandedRow = (rowData: Memo) => (
    <div className='p-4 bg-gray-100'>
      <h3 className='text-lg font-bold mb-2'>Información adicional</h3>
      <p>
        <strong>Nombre completo:</strong> {rowData.firstName} {rowData.lastName}
      </p>
      <p>
        <strong>Edad:</strong> {rowData.age}
      </p>
      <p>
        <strong>Visitas:</strong> {rowData.visits}
      </p>
      <p>
        <strong>Estado:</strong> {rowData.status}
      </p>
      <p>
        <strong>Progreso:</strong> {rowData.progress}%
      </p>
      <p>
        <strong>Más información:</strong> {rowData.moreInfo}
      </p>
    </div>
  );

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
      <Table
        data={memosData}
        columns={columns}
        searchPlaceholder='Buscar memos...'
        pageSize={20}
        renderExpandedRow={renderExpandedRow}
      />
    </section>
  );
};
