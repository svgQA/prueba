import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { memosData } from './memos.data';
import { Memo } from './memos.d';
import { Table } from '@/components/common/table/table';
import { memosColumns } from './memos.columns'; // Importar las columnas
import { Search } from '@/components/common';

export const MemosPage: FunctionComponent = () => {
  const [data, setData] = useState<Memo[]>([]);
  // const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    document.title = 'VX - Memos Service';
    setData(memosData);
  }, []);

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Memos</h1>
      {/* <div className='mb-4'>
        <input
          type='text'
          placeholder='Buscar memos...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.currentTarget.value)}
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div> */}
      <Table<Memo>
        data={data}
        columns={memosColumns}
        pageSize={10}
        search={
          <Search
            id='search-memos'
            name='search-memos'
            keys={['id_1', 'id_2', 'id_3', 'id_4']}
          />
        }
      />
    </section>
  );
};
