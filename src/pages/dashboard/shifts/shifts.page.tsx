import { type FunctionalComponent } from 'preact';
import { AudioButton } from './audio/socket.button';
import { useEffect } from 'preact/hooks';
import { Section, Table } from '@/components/common';

import { type Shift, shiftsData } from './utils';
import { columns } from './components';
import { CardData } from '@/components/compose';

export const ShiftsPage: FunctionalComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

  return (
    <Section>
      <AudioButton />
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total de Turnos'
          count={400}
          subtitle='Turnos registrados'
          color='text-secondary'
          icon='171'
        />

        <CardData
          title='Turnos Activos'
          count={300}
          subtitle='En este momento'
          color='text-primary'
          icon='020'
        />

        <CardData
          title='Turnos Inactivos'
          count={200}
          subtitle='Fuera de servicio'
          color='text-error'
          icon='110'
        />
      </div>
      <Table<Shift> data={shiftsData} columns={columns} />
    </Section>
  );
};
