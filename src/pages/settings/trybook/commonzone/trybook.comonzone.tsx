// CommonZonesPage.tsx
import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { columns } from './comonzone.columns';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useTranslation } from 'react-i18next';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
import { CommonZoneService } from '@/services/trybook/commonzone';

export const TrybookCommonZonesPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const rows = useSignal<any[]>([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('p_common_zone');
  }, [t]);

  useEffect(() => {
    if (selectedCompany) fetchRows();
  }, [selectedCompany]);

  const fetchRows = async () => {
    loading.value = true;
    const res = await CommonZoneService.getCommonZones();
    console.log(res);
    if (res.getStatus()) rows.value = res.getMany();
    loading.value = false;
  };

  const deleteRow = async (id: number) => {
    const req = await CommonZoneService.deleteCommonZone(id);
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    fetchRows();
  };

  const editRow = (id: number) => {
    go({
      to: `/trybook/commonzone/update/${id}`,
      label: 'edit',
      id: 'trybook:commonzones:state:update',
      base: 'setting',
    });
  };

  const handleOnClick = async (action: IRowAction | any) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editRow(action.id as number);
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('commonZone.showAlert.title'),
          message: t('commonZone.showAlert.msg'),
          onConfirm: () => deleteRow(action.id as number),
          onCancel: () => {},
        });
        break;
    }
  };

  return (
    <Table<any>
      data={rows.value}
      columns={columns}
      showExpandableIcon={false}
      onClickAction={handleOnClick}
      pageSize={20}
      isSettingTable
      loading={loading.value}
      absolute
    />
  );
};
