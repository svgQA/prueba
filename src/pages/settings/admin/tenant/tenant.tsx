import { Section, Table } from '@/components/common';
import { CardData } from '@/components/compose';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { columns } from './components';
import { tenantData } from './utils/tenant.data';
import { IUserResponse } from '@/types/auth';

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

      <Table<IUserResponse> data={tenantData} columns={columns} />
    </Section>
  );
};
