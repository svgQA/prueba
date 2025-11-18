import { type FunctionComponent } from 'preact';
import { Table } from '@/components/common/table/table';
import { columns } from './instances.columns';
import { Instance } from './instances.columns';

interface IInstancesTableProps {
  instances: any[];
}

export const InstancesTable: FunctionComponent<IInstancesTableProps> = ({
  instances,
}) => {
  return (
    <div className='absolute inset-0 flex flex-col overflow-hidden'>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Table<Instance> data={instances} columns={columns} isSettingTable />
      </div>
    </div>
  );
};
