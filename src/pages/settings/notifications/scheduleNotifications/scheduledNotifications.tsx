import { FunctionComponent, useEffect } from 'react';
import { useSignal } from '@preact/signals';
import { Table } from '@/components/common/table/table';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import { getColumns } from './components/scheduled.columns';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { SchedulerService } from '@/services/notification/schedule';
import { ToastManager } from '@/utils/toast/toast-manager';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';
import { useNavigation } from '@/utils/hooks/navigation';
export const ScheduledNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationScheduledItem[]>([]);
  const { go } = useNavigation();
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('p_template');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchNotifications();
    }
  }, [selectedCompany]);

  const fetchNotifications = async () => {
    loading.value = true;
    const response = await SchedulerService.getAll('all');
    if (response.getStatus()) {
      notifications.value = response.getMany();
    }
    loading.value = false;
  };

  const editScheduled = (id: string) => {
    go({
      to: `/notification/scheduled/update/${id}`,
      label: 'update',
      id: 'notification:scheduled:state:update',
      base: 'setting',
    });
  };

  const deleteScheduled = async (id: string) => {
    const confirmed = window.confirm(
      '¿Deseas eliminar esta notificación programada?'
    );
    if (!confirmed) return;

    const res = await SchedulerService.deleteScheduledNotification(id);
    if (res.getStatus()) {
      ToastManager.success('s_deleted_success');
      fetchNotifications();
    } else {
      ToastManager.error('s_deleted_error');
    }
  };

  const onClickAction = async ({
    id,
    action,
  }: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => {
    switch (action) {
      case ROW_ACTIONS.UPDATE:
        editScheduled(id);
        break;
      case ROW_ACTIONS.DELETE:
        await deleteScheduled(id);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Table<INotificationScheduledItem>
        data={notifications.value}
        columns={getColumns(onClickAction)}
        pageSize={10}
        isSettingTable
        showExpandableIcon={false}
        loading={loading.value}
        absolute
      />
    </>
  );
};
