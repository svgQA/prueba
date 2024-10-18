import { type FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { memosData } from './memos.data';
import { Memo } from './memos.d';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/common/table/table';
import { InfoIcon, FormattedDate, PriorityBadge } from './memos.columns';

export const MemosPage: FunctionComponent = () => {
  const [data, setData] = useState<Memo[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    document.title = 'VX - Memos Service';
    setData(memosData);
  }, []);

  const columns = useMemo<ColumnDef<Memo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        header: 'Nombre',
      },
      {
        accessorKey: 'noveltyType',
        header: 'Tipo Novedad',
      },
      {
        accessorKey: 'noveltyDate',
        header: 'Fecha Novedad',
        cell: (info) => <FormattedDate date={info.getValue() as string} />,
      },
      {
        accessorKey: 'priority',
        header: 'Prioridad',
        cell: (info) => (
          <PriorityBadge
            priority={info.getValue() as 'Alta' | 'Media' | 'Baja'}
          />
        ),
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

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Buscar memos...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div>
      <Table<Memo>
        data={data}
        columns={columns}
        pageSize={10}
        // expandableData={data}
        // globalFilter={globalFilter}
        // onGlobalFilterChange={setGlobalFilter}
      />
    </section>
  );
};
