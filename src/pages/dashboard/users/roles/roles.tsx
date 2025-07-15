import { FunctionComponent } from 'preact';
import { columns } from './components/roles.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal, Signal } from '@preact/signals';
import { ToastManager } from '@/utils/toast/toast-manager';
import { RoleService } from '@/services/general/role';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';

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
  const roles: Signal<IRole[]> = useSignal([]);
  const { t } = useTranslation();
  const { go } = useNavigation();

  useEffect(() => {
    document.title = t('p_role');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getRoles();
    }
  }, [selectedCompany, location]);

  const getRoles = async () => {
    const request: any = await RoleService.getRoles();
    roles.value = request.data;
  };

  const updateRole = (id: string) => {
    go({
      to: `/users/roles/update/${id}`,
      label: 'edit',
      id: 'roles:update:state',
      base: 'setting',
    });
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
    <>
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
        absolute
      />
    </>
  );
};
