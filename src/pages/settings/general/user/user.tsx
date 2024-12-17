import { Table } from '@/components/common';
import { CardData } from '@/components/compose';
import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { userData } from './utils/user.data';
import { columns } from './components';
import { User } from './utils';

export const UserSettingPage: FunctionComponent = () => {
  // const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    document.title = 'User Settings';
    // setData(userData);
  }, []);
  return (
    <section>
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
      <Table<User> data={userData} columns={columns} unsearch />
    </section>
  );
};
