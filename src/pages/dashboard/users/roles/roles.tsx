import { Button } from '@/components/common/button/button';
import { Section } from '@/components/common/section/section';
import { FunctionComponent } from 'preact';
import { useLocation } from 'wouter';
import { columns } from './components/roles.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import {
  menuInformationSelected as infoMenu,
  setMenu,
} from '../../../settings/store/settings';
import { RoleService } from '@/services/general/role';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useTranslation } from 'react-i18next';

export interface IRole {
  id: number;
  name: string;
  description: string;
}

export interface IRowActionPlace {
  id: string;
  type: string;
  action: ROW_ACTIONS;
}

export const UserRolesPage: FunctionComponent = () => {
  const [_, navigate] = useLocation();
  const roles: Signal<IRole[]> = useSignal([]);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('p_roles');
    getRoles();
  }, []);

  const getRoles = async () => {
    const request: any = await RoleService.getRoles();
    roles.value = request.data;
  };

  const redirect = () => {
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'create' });
    navigate('/users/roles/create');
  };

  const updateRole = (id: string) => {
    // OJO: No traducir, dejar asi los setMenu
    setMenu({ ...infoMenu.value, label: 'edit' });
    navigate(`/users/roles/update/${id}`);
  };

  const deleteRole = async (id: number) => {
    const request = await RoleService.deleteRole(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    getRoles();
  };

  const handleOnClick = async (action: IRowActionPlace | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        updateRole(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('role.alert.title'),
          message: t('role.alert.message'),
          onConfirm: () => {
            deleteRole(action.id);
          },
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-shift'
            label='new'
            icon='039'
            onClick={redirect}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
      </div>
      <Table<IRole>
        data={roles.value}
        columns={columns}
        pageSize={20}
        visibility={{
          name: true,
          description: true,
        }}
        onClickAction={handleOnClick}
        isSettingTable
      />
    </Section>
  );
};
