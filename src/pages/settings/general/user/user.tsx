import { Section, Table } from '@/components/common';
import { CardData } from '@/components/compose';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { userData } from './utils/tenant.data';
import { columns } from './components';
import { IUserResponse } from '@/types/auth';

export const UserSettingPage: FunctionComponent = () => {
  useEffect(() => {
    document.title = 'User Settings';
  }, []);
  return (
    <Section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Total Usuario'
          count={400}
          subtitle='Usuarios registrados'
          color='text-secondary'
          icon='171'
        />

        <CardData
          title='Clientes'
          count={300}
          subtitle='Clientes registrados'
          color='text-primary'
          icon='020'
        />

        <CardData
          title='Administradores'
          count={200}
          subtitle='Administradores Registrados'
          color='text-error'
          icon='110'
        />
      </div>

      <Table<IUserResponse> data={userData} columns={columns} />
    </Section>
  );
};
