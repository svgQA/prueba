import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { userData } from './utils/user.data';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { setUser, USER_MODE_SERVICE } from './create/store/user';
import { CardData, CardMenu } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { User } from './utils/user';
import { columns } from './components/users.columns';

export const UserSettingPage: FunctionComponent = () => {
  // const [data, setData] = useState<User[]>([]);
  useEffect(() => {
    document.title = 'User Settings';
    // setData(userData);
  }, []);
  return (
    <section>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardMenu
          menu={{
            to: PAGES_LIST_ROUTER.dashboard.setting.setting.userCreate.to,
            label: 'create',
            id: 'user-create',
          }}
          title='Start from scratch'
          description='Get started with a blank template'
          icon='123'
          event={() => setUser({ mode: USER_MODE_SERVICE.CREATE })}
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
