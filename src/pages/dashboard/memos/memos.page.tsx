import { type FunctionComponent } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { memosData } from './memos.data';
import { Memo } from './memos.d';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/components/common/table/table';
import { ProgressBar, InfoIcon, Modal } from './memos.columns';

export const MemosPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Memos Service';
  }, []);

  const [selectedMemo, setSelectedMemo] = useState<Memo | null>(null);

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
        accessorKey: 'moreInfo',
        header: 'Más información',
        cell: (info) => (
          <InfoIcon onClick={() => setSelectedMemo(info.row.original)} />
        ),
      },
    ],
    []
  );

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
      <Table
        data={memosData}
        columns={columns}
        searchPlaceholder='Buscar memos...'
        pageSize={20}
      />
      <Modal isOpen={!!selectedMemo} onClose={() => setSelectedMemo(null)}>
        {selectedMemo && (
          <div>
            <h2 className='text-xl font-bold mb-2'>Información adicional</h2>
            <p>
              <strong>Nombre:</strong> {selectedMemo.firstName}{' '}
              {selectedMemo.lastName}
            </p>
            <p>
              <strong>Edad:</strong> {selectedMemo.age}
            </p>
            <p>
              <strong>Visitas:</strong> {selectedMemo.visits}
            </p>
            <p>
              <strong>Estado:</strong> {selectedMemo.status}
            </p>
            <p>
              <strong>Progreso:</strong> {selectedMemo.progress}%
            </p>
            <p>
              <strong>Más información:</strong> {selectedMemo.moreInfo}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
};
