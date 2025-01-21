import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Section } from '@/components/common/section/section';
// Ajusta si tu Section está en otro lado
import { Table } from '@/components/common/table/table';
import { IAccess, accesData } from './utils';
import { accessColumns } from './components/access.columns';
import { ExpandableAccess } from '@/components/compose/table/expandable/access';
import { CardData } from '@/components/compose/cards';

export const AccesPage: FunctionalComponent = () => {
  const [data, setData] = useState<IAccess[]>([]);

  useEffect(() => {
    document.title = 'VX - Access Service';

    // Cargamos los datos ficticios
    setData(accesData);
  }, []);

  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Visitas Mensuales'
          count={1200}
          subtitle='Registros de este mes'
          color='text-secondary'
          icon='189'
        />
        <CardData
          title='Vehículos que ingresaron'
          count={42}
          subtitle='Por día'
          color='text-primary'
          icon='183'
        />
        <CardData
          title='Vehículos que ingresaron y salieron'
          count={38}
          subtitle='Por día'
          color='text-error'
          icon='221'
        />
      </div>

      <Table<IAccess>
        data={data}
        columns={accessColumns}
        pageSize={10}
        // Reutilizando la propiedad "expandable" (igual que en shifts)
        expandable={(row: IAccess) => <ExpandableAccess row={row} />}
      />
    </Section>
  );
};
