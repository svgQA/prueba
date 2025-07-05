import { type FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { PAGES_LIST_ROUTER } from '@/utils/routing';
import { setUser, USER_MODE_SERVICE } from './create/store/user';
import { CardData } from '@/components/compose/cards';
import { Table } from '@/components/common/table/table';
import { columns } from './components/users.columns';
import { UserService } from '@/services/general/user';
import { useSignal } from '@preact/signals';
import { IUserResponse } from '@/types/auth';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { IRowAction } from '@/components/common/table/interface';
import { Button } from '@/components/common/button/button';
import { useLocation } from 'wouter';
import { appendHistory } from '../../store/settings';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';

export const UserSettingPage: FunctionComponent = () => {
  const users = useSignal<IUserResponse[]>([]);
  const [_, navigate] = useLocation();

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_setting');
    getUsersHandler();
  }, []);

  const getUsersHandler = async () => {
    const response = await UserService.get_all({ items: 100, page: 1 });
    if (!response.getStatus()) return;
    users.value = response.getMany();
  };

  const deletePlace = async (id: number) => {
    const request = await UserService.delete(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getUsersHandler();
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
      case ROW_ACTIONS.DELETE: {
        await deletePlace(Number(action.id));
        break;
      }
      default:
        break;
    }
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.userCreate.to,
      label: 'create',
      id: 'user-create',
    };
    navigate(menu.to);
    appendHistory(menu);
    setUser({ mode: USER_MODE_SERVICE.CREATE });
  };

  return (
    <section>
      <div className='flex flex-row w-full justify-evenly'>
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
      <div className='max-h-screen relative'>
        <div className='py-2 flex flex-row justify-center xl:justify-between px-1 items-center overflow-visible xl:absolute relative z-10 w-full xl:w-fit'>
          <div className='flex flex-row items-center !w-full xl:!w-fit md:w-auto justify-between'>
            <Button
              name='button-create-shift'
              label='Nueva Usuario'
              icon='039'
              onClick={redirect}
              className='px-6 py-1 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
            />
          </div>
        </div>
        <Table<IUserResponse>
          data={users.value}
          columns={columns}
          onClickAction={handleOnClick}
          visibility={{
            id: false,
            createdAt: false,
            sucursal: false,
            area: false,
            job: false,
            // city: false,
            // state: false,
            // country: false,
            // cardId: false,
          }}
        />
      </div>
    </section>
  );
};
