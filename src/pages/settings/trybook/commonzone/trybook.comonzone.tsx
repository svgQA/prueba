// CommonZonesPage.tsx
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
import { CommonZoneService } from '@/services/trybook/commonzone';
import { columns, CommonZoneRow } from './comonzone.columns';

interface ListResponse<T> {
  getStatus(): boolean;
  getMany(): T[];
}
interface BasicResponse {
  getStatus(): boolean;
}

export const TrybookCommonZonesPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const rows = useSignal<CommonZoneRow[]>([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('p_common_zone');
  }, [t]);

  const fetchRows = async () => {
    loading.value = true;
    try {
      const res =
        (await CommonZoneService.getCommonZones()) as unknown as ListResponse<CommonZoneRow>;
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
    const req = (await CommonZoneService.deleteCommonZone(
      id
    )) as unknown as BasicResponse;
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    void fetchRows();
  };

  const editRow = (id: number) => {
    go({
      to: `/trybook/commonzone/update/${id}`,
      label: 'edit',
      id: 'trybook:commonzones:state:update',
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
          title: t('i_showAlert_title_zone'),
          message: t('i_showAlert_msg_zone'),
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
    <Table<CommonZoneRow>
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
