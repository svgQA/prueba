import { type FunctionComponent } from 'preact';
import { IInstance, ITenant } from '@/utils/network/types';
import { Badge } from '@/components/common/badge/badge';

interface InstanceCardProps {
  instance: IInstance;
}

const TenantList: FunctionComponent<{ tenants: ITenant[] }> = ({ tenants }) => {
  return (
    <div className='mt-4 space-y-2'>
      <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
        Tenants
      </h4>
      <div className='max-h-48 overflow-y-auto space-y-2 vox-scroll-design'>
        {tenants.map((tenant) => (
          <div
            key={tenant.id}
            className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg'
          >
            <span className='text-sm text-gray-600 dark:text-gray-400'>
              {tenant.name}
            </span>
            <Badge
              status={tenant.status === 'ACTIVE' ? 'success' : 'error'}
              label={tenant.status}
            ></Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InstanceCard: FunctionComponent<InstanceCardProps> = ({
  instance,
}) => {
  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-[400px] transition-colors duration-200'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
            {instance.name}
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            ID: {instance.id}
          </p>
        </div>
        <Badge
          status={instance.status ? 'success' : 'error'}
          label={instance.status ? 'Active' : 'Inactive'}
        ></Badge>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-4'>
        <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Count</p>
          <p className='text-lg font-semibold text-gray-900 dark:text-white'>
            {instance.count}
          </p>
        </div>
        <div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Tenants</p>
          <p className='text-lg font-semibold text-gray-900 dark:text-white'>
            {instance.tenants.length}
          </p>
        </div>
      </div>

      <div className='text-sm text-gray-500 dark:text-gray-400 space-y-1'>
        {/*
        <p>Created: {formatDate(instance.createdAt)}</p>
        <p>Updated: {formatDate(instance.updatedAt)}</p>
        */}
      </div>

      <TenantList tenants={instance.tenants} />
    </div>
  );
};
