// UserResidencesPage.tsx
import { Table } from '@/components/common/table/table';
import { FunctionComponent } from 'preact';
import { columns, type ResidenceRow } from './residence.columns';
import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { ToastManager } from '@/utils/toast/toast-manager';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { useTranslation } from 'react-i18next';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
import { ResidencesService } from '@/services/trybook/residences';

/* Tipos mínimos de respuesta */
interface ListResponse<T> {
  getStatus(): boolean;
  getMany(): T[];
}
interface BasicResponse {
  getStatus(): boolean;
}

export const TrybookResidencesPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const rows = useSignal<ResidenceRow[]>([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('p_residence');
  }, [t]);

  const fetchRows = async () => {
    loading.value = true;
    try {
      const res =
        (await ResidencesService.getResidences()) as unknown as ListResponse<ResidenceRow>;
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

  const deleteRow = async (uuid: string) => {
    const req = (await ResidencesService.deleteResidence(
      uuid
    )) as unknown as BasicResponse;
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    void fetchRows();
  };

  const editRow = (uuid: string) => {
    go({
      to: `/trybook/residence/update/${uuid}`,
      label: 'edit',
      id: 'trybook:residences:state:update',
      base: 'setting',
    });
  };

  const handleOnClick = (action: IRowAction): void => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        editRow(String(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        showAlert({
          title: t('i_showAlert_title_zone'),
          message: t('i_showAlert_msg_zone'),
          onConfirm: () => {
            void deleteRow(String(action.id));
          },
          onCancel: () => {},
        });
        break;
      default:
        break;
    }
  };

  return (
    <Table<ResidenceRow>
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
