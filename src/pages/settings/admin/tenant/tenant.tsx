import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { TenantService } from '@/services/general/tenant';
import { IInstance } from '@/utils/network/types';
import { useSignal } from '@preact/signals';
import { InstanceCard } from '@/components/compose/cards/instance.card';
import { useTranslation } from 'react-i18next';

export const TenantSettingPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const instances = useSignal<IInstance[]>([]);

  useEffect(() => {
    document.title = t('p_setting');
    getTenant();
  }, []);

  const getTenant = async () => {
    const response = await TenantService.get_instances();
    if (!response.getStatus()) return;
    instances.value = response.getMany();
  };

  return (
    <Section>
      <div className='flex flex-row gap-4 justify-center flex-wrap'>
        {instances.value.map((instance) => (
          <InstanceCard key={instance.id} instance={instance} />
        ))}
      </div>
      {/*
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
      */}
    </Section>
  );
};
