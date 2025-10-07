// CommonSlotsPage.tsx
import { FunctionComponent } from 'preact';
import { useEffect, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useTranslation } from 'react-i18next';

import { Table } from '@/components/common/table/table';
import { IRowAction } from '@/components/common/table/interface';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { showAlert } from '@/components/common/show-alert/show-alert';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useNavigation } from '@/utils/hooks/navigation';
import { useUserStore } from '@/store/slices';

import { columns, type CommonSlotRow } from './commonslot.columns';
import { CommonSlotService } from '@/services/trybook/comonslot';

interface ListResponse<T> {
  getStatus(): boolean;
  getMany(): T[];
}
interface BasicResponse {
  getStatus(): boolean;
}

export const TrybookCommonSlotsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const rows = useSignal<CommonSlotRow[]>([]);
  const loading = useSignal<boolean>(false);
  const { go } = useNavigation();
  const { selectedCompany } = useUserStore();

  useEffect(() => {
    document.title = t('h_tickets');
  }, [t]);

  const fetchRows = useCallback(async () => {
    loading.value = true;
    try {
      const res =
        (await CommonSlotService.getSlots()) as unknown as ListResponse<CommonSlotRow>;
      if (res.getStatus()) rows.value = res.getMany();
    } catch {
      ToastManager.error('s_fetch_error');
    } finally {
      loading.value = false;
    }
  }, []);

  useEffect(() => {
    if (selectedCompany) void fetchRows();
  }, [selectedCompany, fetchRows]);

  const deleteRow = async (uuid: string) => {
    const req = (await CommonSlotService.deleteSlot(
      uuid
    )) as unknown as BasicResponse;
    if (!req.getStatus()) return;
    ToastManager.success('s_deleted_success');
    void fetchRows();
  };

  const editRow = (uuid: string) => {
    go({
      to: `/trybook/commonslot/update/${uuid}`,
      label: 'edit',
      id: 'trybook:commonslots:state:update',
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
          title: t('i_showAlert_title'),
          message: t('i_showAlert_msg'),
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
    <section>
      <Table<CommonSlotRow>
        data={rows.value}
        columns={columns}
        showExpandableIcon={false}
        onClickAction={handleOnClick}
        pageSize={20}
        isSettingTable
        loading={loading.value}
        absolute
      />
    </section>
  );
};
