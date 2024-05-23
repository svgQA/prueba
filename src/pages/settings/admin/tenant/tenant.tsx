import { Expand } from '@/components/common';
import { TenantService } from '@/services';
import { IInstance } from '@/types';
import { type FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export const TenantSettingPage: FunctionComponent = () => {
  const tenantService = new TenantService();
  const [instances, setInstances] = useState<IInstance[]>([]);

  useEffect(() => {
    document.title = 'Tenant Settings';
    getTenant();
  }, []);

  const getTenant = async () => {
    const response = await tenantService.instances();
    if (response.getStatus()) {
      const data = response.getMany();
      setInstances(data);
    }
  };
  return (
    <section className='h-full'>
      {instances.map((instance) => (
        <Expand
          key={`instances-id-${instance.name}`}
          name={`instances-id-${instance.name}`}
          header={
            <>
              <h3 className='text-xl font-bold'>{instance.name}</h3>
              <div>
                <p className='text-sm text-gray-500'>{instance.id}</p>
                <div className='flex flex-row justify-between'>
                  <p>{instance.host}</p>
                  <p>{instance.port}</p>
                  <p>{instance.url}</p>
                  <p>{instance.count}</p>
                  <p>{instance.database}</p>
                  <p>{instance.status}</p>
                </div>
              </div>
            </>
          }
        >
          {instance?.tenants?.map((tenant) => <div>{tenant.name}</div>)}
        </Expand>
      ))}
    </section>
  );
};
