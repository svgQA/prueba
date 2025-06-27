// src/pages/dashboard/correspondence/correspondence.page.tsx

import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards'; // Ajusta ruta si es distinto
import { ExpandableCorrespondence } from '@/components/compose/table/expandable/correspondence'; // Ajusta ruta si es distinto
import { ICorrespondence, correspondenceData } from './utils';
import { correspondenceColumns } from './components/correspondence.columns';

export const CorrespondencePage: FunctionalComponent = () => {
  const [data, setData] = useState<ICorrespondence[]>([]);

  useEffect(() => {
    document.title = 'TR - Correspondencia Service';
    // Cargamos datos ficticios
    setData(correspondenceData);
  }, []);

  return (
    <Section>
      {/* Tarjetas superiores, como en Access o Shifts */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total de Correspondencias'
          count={data.length}
          subtitle='Registros de paquetes'
          color='text-secondary'
          icon='171'
        />
        <CardData
          title='Paquetes Entregados'
          count={data.filter((item) => item.status === 'Entregado').length}
          subtitle='Recogidos por el propietario'
          color='text-primary'
          icon='020'
        />
        <CardData
          title='Paquetes en Portería'
          count={data.filter((item) => item.status === 'En Portería').length}
          subtitle='Aún sin recoger'
          color='text-error'
          icon='110'
        />
      </div>

      <Table<ICorrespondence>
        data={data}
        columns={correspondenceColumns}
        pageSize={10}
        // Expansible (similar a Access)
        expandable={(row: ICorrespondence) => (
          <ExpandableCorrespondence row={row} />
        )}
        // Si deseas ocultar columnas, p. ej. con visibility
        // visibility={{ whoPickedUp: true, ... etc}}
      />
    </Section>
  );
};
