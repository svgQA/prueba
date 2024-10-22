import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Table } from '@/components/common/table/table';
import { shiftsData } from './shifts.data';
import { shiftsColumns } from './shift.columns';

export const ShiftsPage: FunctionalComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Turnos</h1>
      <Table data={shiftsData} columns={shiftsColumns} />
    </section>
  );
};
