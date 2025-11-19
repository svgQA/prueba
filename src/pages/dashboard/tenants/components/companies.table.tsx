import { type FunctionComponent } from 'preact';
import { Table } from '@/components/common/table/table';
import { columns } from './companies.columns';
import { Tenant } from './companies.columns';

interface ICompaniesTableProps {
  tenants: any[];
}

export const CompaniesTable: FunctionComponent<ICompaniesTableProps> = ({
  tenants,
}) => {
  return (
    <div className='absolute inset-0 flex flex-col overflow-hidden'>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Table<Tenant>
          data={tenants}
          columns={columns}
          visibility={{
            id: false,
          }}
          isSettingTable
        />
      </div>
    </div>
  );
};
