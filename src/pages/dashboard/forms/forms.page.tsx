import { FormService } from '@/services';
import { IResponseResponse } from '@/types/form';
import { useSignal } from '@preact/signals';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { columns } from './components/form.columns';

export const FormsPage: FunctionComponent = () => {
  const responses = useSignal<IResponseResponse[]>([]);

  const getResponseHandler = async () => {
    const response = await FormService.get_response_all();
    if (!response.getStatus()) return;
    responses.value = response.getMany();
  };

  useEffect(() => {
    document.title = 'VX - Forms Service';
    getResponseHandler();
  }, []);

  return (
    <Section padding>
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
      <Table<IResponseResponse>
        data={responses.value}
        columns={columns}
        pageSize={8}
      />
    </Section>
  );
};
