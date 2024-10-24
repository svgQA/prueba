import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Table } from '@/components/common/table/table';
import { shiftsData } from './shifts.data';
import { shiftsColumns } from './shift.columns';
import { Shift } from './shifts';
import { Search } from '@/components/common';

export const ShiftsPage: FunctionalComponent = () => {
  useEffect(() => {
    document.title = 'VX - Shifts Service';
  }, []);

  return (
    <section className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Turnos</h1>
      <Table<Shift>
        search={
          <Search
            id='search-shift'
            name='search-shift'
            keys={['id_1', 'id_2', 'id_3', 'id_4']}
          />
        }
        data={shiftsData}
        columns={shiftsColumns}
      />
    </section>
  );
};
