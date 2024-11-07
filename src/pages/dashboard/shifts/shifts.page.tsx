import { type FunctionalComponent } from 'preact';
import { AudioButton } from './audio/socket.button';
import { useEffect } from 'preact/hooks';
import { Section, Table } from '@/components/common';

import { type Shift, shiftsData } from './utils';
import { columns } from './components';

export const ShiftsPage: FunctionalComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

  return (
    <Section>
      <AudioButton />
      <h1 className='text-2xl font-bold mb-4'>Gestión de Turnos</h1>
      <Table<Shift> data={shiftsData} columns={columns} />
    </Section>
  );
};
