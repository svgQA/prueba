import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { setUser, USER_MODE_SERVICE } from './create/store/user';
import { CardData, CardMenu } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { columns } from './components/users.columns';
import { UserService } from '@/services/user';
import { useSignal } from '@preact/signals';
import { IUserResponse } from '@/types/auth';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';

export const UserSettingPage: FunctionComponent = () => {
  const users = useSignal<IUserResponse[]>([]);
  useEffect(() => {
    document.title = 'User Settings';
    getUsersHandler();
  }, []);

  const getUsersHandler = async () => {
    const response = await UserService.get_all({ items: 100, page: 1 });
    if (!response.getStatus()) return;
    users.value = response.getMany();
  };

  const handleOnClick = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.CREATE: {
        const response = await UserService.createProfile(action.id);
        if (!response.getStatus()) {
          return;
        }
        return await getUsersHandler();
      }
      default:
        break;
    }
  };

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
      <Table<IUserResponse>
        data={users.value}
        columns={columns}
        unsearch
        onClickAction={handleOnClick}
        visibility={{
          createdAt: false,
          sucursal: false,
          area: false,
          job: false,
          city: false,
          state: false,
          country: false,
          cardId: false,
        }}
      />
    </section>
  );
};
