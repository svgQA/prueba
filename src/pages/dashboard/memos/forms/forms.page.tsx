import { Section } from '@/components/common';
import { CardData } from '@/components/compose';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';

export const FormsPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'VX - Forms Service';
  }, []);
  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total Formularios'
          count={150}
          subtitle='Formularios creados'
          color='text-secondary'
          icon='123'
        />

        <CardData
          title='Formularios Activos'
          count={100}
          subtitle='En uso'
          color='text-primary'
          icon='089'
        />

        <CardData
          title='Formularios Archivados'
          count={50}
          subtitle='No disponibles'
          color='text-error'
          icon='098'
        />
      </div>
    </Section>
  );
};
