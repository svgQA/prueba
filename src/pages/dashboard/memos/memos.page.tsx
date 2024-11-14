import { type FunctionComponent } from 'preact';
import { Section, Table } from '@/components/common';
import { useEffect, useState } from 'preact/hooks';

import { type Memo, memosData } from './utils';
import { columns } from './components';
import { ExpandableMemos } from '@/components/compose';
import { CardData } from '@/components/compose';

export const MemosPage: FunctionComponent = () => {
  const [data, setData] = useState<Memo[]>([]);

  useEffect(() => {
    document.title = 'VX - Memos Service';
    setData(memosData);
  }, []);

  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total de Formularios'
          count={150}
          subtitle='Formularios registrados'
          color='text-secondary'
          icon='171'
        />

        <CardData
          title='Formularios Completados'
          count={100}
          subtitle='Procesados exitosamente'
          color='text-primary'
          icon='020'
        />

        <CardData
          title='Formularios Pendientes'
          count={50}
          subtitle='En espera de revisión'
          color='text-error'
          icon='110'
        />
      </div>
      <Table<Memo>
        data={data}
        columns={columns}
        pageSize={16}
        expandable={(row: Memo) => <ExpandableMemos row={row} />}
      />
    </Section>
  );
};
