import { FunctionalComponent } from 'preact';
import { useEffect } from 'preact/hooks';

import { useSignal } from '@preact/signals';
import { IReportResponse } from '@/types/form';
import { FormService } from '@/services';
import { Section } from '@/components/common/section/section';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { ExpandableShift } from '@/components/compose/table';
import { Shift } from './utils/shifts';
import { shiftsData } from './utils/shifts.data';
import { columns } from './components/shift.columns';

export const ShiftsPage: FunctionalComponent = () => {
  const reports = useSignal<IReportResponse[]>([]);

  const getReportHandler = async () => {
    const response = await FormService.get_report_all();
    if (!response.getStatus()) return;
    reports.value = response.getMany();
  };

  useEffect(() => {
    document.title = 'VX - Shifts Service';
    getReportHandler();
  }, []);

  return (
    <Section>
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

      <Table<Shift>
        data={shiftsData}
        columns={columns}
        expandable={(row: Shift) => <ExpandableShift row={row} />}
        pageSize={20}
        visibility={{
          address: false,
          city: false,
          employeeId: false,
          duration: false,
        }}
      />
    </Section>
  );
};
