// TrybookResourceZonesPage.tsx
import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useTranslation } from 'react-i18next';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
import { columns, ResourceZoneRow } from './resourcezone.columns';
import { ResourceZoneService } from '@/services/trybook/resourcezone';

interface ListResponse<T> {
  getStatus(): boolean;
  getMany(): T[];
}
interface BasicResponse {
  getStatus(): boolean;
}

export const TrybookResourceZonesPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const rows = useSignal<ResourceZoneRow[]>([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('p_resource_zone');
  }, [t]);

  const fetchRows = async () => {
    loading.value = true;
    try {
      const res =
        (await ResourceZoneService.getResourceZones()) as unknown as ListResponse<ResourceZoneRow>;
      if (res.getStatus()) rows.value = res.getMany();
    } catch {
      ToastManager.error('s_fetch_error');
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    if (selectedCompany) void fetchRows();
  }, [selectedCompany]);

  const deleteRow = async (id: number) => {
    const req = (await ResourceZoneService.deleteResourceZone(
      id
    )) as unknown as BasicResponse;
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    void fetchRows();
  };

  const editRow = (id: number) => {
    go({
      to: `/trybook/resourcezone/update/${id}`,
      label: 'edit',
      id: 'trybook:resourcezone:state:update',
      base: 'setting',
    });
  };

  const handleOnClick = (action: IRowAction): void => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editRow(Number(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('i_showAlert_title_resource'),
          message: t('i_showAlert_msg_resource'),
          onConfirm: () => {
            void deleteRow(Number(action.id));
          },
          onCancel: () => {},
        });
        break;
      default:
        break;
    }
  };

  return (
    <Table<ResourceZoneRow>
      data={rows.value}
      columns={columns}
      showExpandableIcon={false}
      onClickAction={handleOnClick}
      isSettingTable
      loading={loading.value}
      absolute
    />
  );
};
