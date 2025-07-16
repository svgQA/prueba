import { FunctionComponent } from 'preact';
import { columns } from './components/group.columns';
import { Table } from '@/components/common/table/table';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';

import { GeneralService } from '@/services';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';

export const GroupSettingPage: FunctionComponent = () => {
  const groups = useSignal<any[]>([]);
  const { go } = useNavigation();

  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_smart_group');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      getGroups();
    }
  }, [selectedCompany]);

  const getGroups = async () => {
    const response = await GeneralService.getSmartGroups();
    if (!response.getStatus()) return;
    groups.value = response.getMany();
  };

  const handleOnClick = async (action: any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        update(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('smartGroup.alert.title'),
          message: t('smartGroup.alert.message', {
            name: action.name,
          }),
          onConfirm: () => deleteGroup(action.id),
          onCancel: () => {},
        });
        break;
    }
  };

  const deleteGroup = async (id: string) => {
    const response = await GeneralService.deleteGroup(id);
    if (!response.getStatus()) return;
    ToastManager.success(t('smartGroup.deleted'));
    getGroups();
  };

  const update = (id: string) => {
    go({
      to: `/security/groups/update/${id}`,
      label: 'edit',
      id: 'security:groups:state:update',
      base: 'setting',
    });
  };

  return (
    <>
      <Table<any>
        data={groups.value}
        columns={columns}
        pageSize={20}
        onClickAction={handleOnClick}
        isSettingTable
        absolute
      />
    </>
  );
};
