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
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { useNavigation } from '@/utils/utilities/navigation';
export const GroupSettingPage: FunctionComponent = () => {
  const groups = useSignal<any[]>([]);
  const { redirectSettings } = useNavigation();

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
    redirectSettings(
      PAGES_LIST_ROUTER.dashboard.setting.base,
      `/security/groups/update/${id}`,
      'edit',
      'groups-update'
    );
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
