import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { tenantData } from './utils/tenant.data';
import { ITenantResponse } from '@/types/tenant';
import { Section } from '@/components/common/section/section';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { columns } from './components/tenant.columns';

export const TenantSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'Tenant Settings';
    getTenant();
  }, []);

  const getTenant = async () => {};

  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total Marcas'
          count={400}
          subtitle='Tenant registrados'
          color='text-secondary'
          icon='171'
        />

        <CardData
          title='Nuevas Marcas'
          count={300}
          subtitle='En este momento'
          color='text-primary'
          icon='020'
        />

        <CardData
          title='Numero de Empresas'
          count={200}
          subtitle='Total'
          color='text-error'
          icon='110'
        />
      </div>

      <Table<ITenantResponse> data={tenantData} columns={columns} />
    </Section>
  );
};
