import { type FunctionComponent } from 'preact';
import { Section, Table } from '@/components/common';
import { useEffect, useState } from 'preact/hooks';

import { type Memo, memosData } from './utils';
import { columns } from './components';

export const MemosPage: FunctionComponent = () => {
  const [data, setData] = useState<Memo[]>([]);

  useEffect(() => {
    document.title = 'VX - Memos Service';
    setData(memosData);
  }, []);

  return (
    <Section>
      <h2 className='text-2xl font-bold m-1'>Gestión de Memos</h2>
      <Table<Memo> data={data} columns={columns} pageSize={16} />
    </Section>
  );
};
