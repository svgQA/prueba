import { type FunctionComponent } from 'preact';
import { useState, useEffect } from 'preact/compat';
import { useTranslation } from 'react-i18next';
import { useSignal, Signal } from '@preact/signals';
import { toast } from 'react-toastify';

import { Modal } from '@/components/common/modal/modal';
import { TenantService } from '@/services';
import { useUserStore } from '@/store/slices';
import {
  CreateTenantForm,
  CreateInstanceForm,
  CompaniesTable,
  InstancesTable,
  DatabasesTab,
} from './components';

interface ITenantsModalProps {
  open: Signal<boolean>;
}

export const TenantsModal: FunctionComponent<ITenantsModalProps> = ({
  open,
}) => {
  const { t } = useTranslation();
  const { getUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<
    'tenant' | 'instance' | 'companies' | 'databases'
  >('tenant');
  const [expand, setExpand] = useState<boolean>(false);
  const tenants = useSignal<any[]>([]);
  const instances = useSignal<any[]>([]);

  useEffect(() => {
    if (open.value) {
      getTenants();
      getInstances();
    }
  }, [open.value]);

  const onTenantSubmit = async (values: any) => {
    const request = await TenantService.create_tenant(values);
    if (!request.getStatus()) return;
    toast.success('s_tenant_created');
    getTenants();
  };

  const onInstanceSubmit = async (values: any) => {
    const request = await TenantService.create_instance(values);
    if (!request.getStatus()) return;
    toast.success('s_instance_created');
    getInstances();
  };

  const getTenants = async () => {
    const user = getUser();

    if (user?.email != 'juanpablorodriguezfernandez93@gmail.com') {
      return;
    }
    const request = await TenantService.get_tenants();
    if (!request.getStatus()) return;
    tenants.value = request.getMany();
  };

  const getInstances = async () => {
    const user = getUser();

    if (user?.email != 'juanpablorodriguezfernandez93@gmail.com') {
      return;
    }
    const request = await TenantService.get_instances();
    if (!request.getStatus()) return;
    instances.value = request.getMany();
  };

  return (
    <Modal
      open={open.value}
      onClose={() => {
        open.value = false;
      }}
      name='tenant-modal'
      id='tenant-modal'
      expandable
      theme
      setExpandable={setExpand}
      header={
        <div className='flex flex-row w-full items-center justify-between px-3'></div>
      }
    >
      <div
        className={`w-full relative ${expand ? 'max-h-[88vh] min-h-[88vh]' : 'max-h-[73vh] min-h-[73vh]'}`}
      >
        <div className='w-full p-4 flex flex-col h-full'>
          <div className='flex flex-wrap border-b mb-4 gap-2'>
            <button
              className={`px-4 py-2 ${activeTab === 'tenant' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('tenant')}
            >
              {t('h_create_tenant')}
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'companies' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('companies')}
            >
              {t('h_companies')}
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'instance' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('instance')}
            >
              {t('h_create_instance')}
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'databases' ? 'border-b-2 border-primary' : ''}`}
              onClick={() => setActiveTab('databases')}
            >
              {t('h_databases')}
            </button>
          </div>
          <div className='mt-4 relative flex-1 min-h-0'>
            {activeTab === 'tenant' ? (
              <CreateTenantForm onSubmit={onTenantSubmit} />
            ) : activeTab === 'instance' ? (
              <CreateInstanceForm onSubmit={onInstanceSubmit} />
            ) : activeTab === 'databases' ? (
              <InstancesTable instances={instances.value} />
            ) : activeTab === 'companies' ? (
              <CompaniesTable tenants={tenants.value} />
            ) : (
              <DatabasesTab />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
