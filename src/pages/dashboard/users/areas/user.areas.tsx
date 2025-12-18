import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { columns } from './area.columns';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { IUserAreaResponse } from '@/types/user/user.response';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useTranslation } from 'react-i18next';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
import { AreaService } from '@/services/general/area';

export const UserAreasPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const areas = useSignal<IUserAreaResponse[]>([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();

  useEffect(() => {
    document.title = t('p_area');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchAreas();
    }
  }, [selectedCompany, location]);

  const fetchAreas = async () => {
    loading.value = true;
    const response = await AreaService.getAreas();
    if (response.getStatus()) {
      areas.value = response.getMany();
    }
    loading.value = false;
  };

  const deleteArea = async (id: number) => {
    const request = await AreaService.deleteArea(id);
    if (!request.getStatus()) return;
    ToastManager.success('s_deleted_success');
    fetchAreas();
  };

  const editArea = (id: string) => {
    go({
      to: `/users/areas/update/${id}`,
      label: 'edit',
      id: 'users:areas:state:update',
      base: 'setting',
    });
  };

  const handleOnClick = async (action: IRowAction | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editArea(action.id);
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('l_delete_area'),
          message: t('i_message_area'),
          onConfirm: () => deleteArea(action.id),
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <>
      <Table<any>
        data={areas.value}
        columns={columns}
        showExpandableIcon={false}
        onClickAction={handleOnClick}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </>
  );
};
