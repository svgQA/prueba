import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards';
import { INotificationListItem } from '@/types/notification/INotificationTypes';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { getColumns } from './components/history.columns';
import { useTranslation } from 'react-i18next';
import { NotificationHistoryService } from '@/services';
import { useUserStore } from '@/store/slices';
import { IRowAction } from '@/components/common/table/interface';
import { HistoryForm } from './components/history.upsert';
import { ButtonsPage, CardsPage, SectionPage } from '@/pages/component';

export const HistoryNotificationsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const notifications = useSignal<INotificationListItem[]>([]);
  const totalNotifications = useSignal<number>(0);
  const openRate = useSignal<number>(0);
  const notificationsThisMonth = useSignal<number>(0);
  const loading = useSignal<boolean>(false);
  const { selectedCompany } = useUserStore();
  const showUpsertModal = useSignal<boolean>(false);
  const idUpsert = useSignal<string>();

  useEffect(() => {
    document.title = t('p_history');
  }, []);

  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchAll();
    }
  }, [selectedCompany, location]);

  const fetchAll = async () => {
    await Promise.all([fetchNotifications(), fetchDashboardStats()]);
  };

  const fetchNotifications = async () => {
    try {
      loading.value = true;
      const res = await NotificationHistoryService.getNotificationList();
      notifications.value = res;
    } catch (error) {
      ToastManager.error('s_loading_error');
    } finally {
      loading.value = false;
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const stats = await NotificationHistoryService.getDashboardData();
      totalNotifications.value = stats.totalNotifications;
      openRate.value = stats.openRate;
      notificationsThisMonth.value = stats.notificationsOfMonth;
    } catch (error) {
      ToastManager.error('s_loading_error');
    }
  };

  /* const handleRunCron = async () => {
    try {
      await NotificationHistoryService.runSchedulerTask();
      ToastManager.success('s_execute_success');
      await fetchAll();
    } catch (error) {
      ToastManager.error(t('history.errors.cronExecution'));
    }
  }; */

  const toggleUpsertModal = () => {
    showUpsertModal.value = !showUpsertModal.value;
  };

  const clearUpsertModal = () => {
    idUpsert.value = undefined;
    showUpsertModal.value = false;
  };

  const handleUpsert = (id?: string) => {
    clearUpsertModal();
    if (id) idUpsert.value = id;
    toggleUpsertModal();
  };

  const deleteUpsert = async (id: string) => {
    const response = await NotificationHistoryService.deleteNotification(id);
    if (!response.getStatus()) return;
    await fetchAll();
  };

  const onClickAction = async (action: IRowAction) => {
    switch (action.action) {
      case ROW_ACTIONS.UPDATE:
        handleUpsert(String(action.id));
        break;
      case ROW_ACTIONS.DELETE:
        deleteUpsert(String(action.id));
        break;
    }
  };

  return (
    <SectionPage
      padding
      cards={
        <CardsPage>
          <CardData
            title={t('history.cards.notificationShifts')}
            count={totalNotifications.value}
            subtitle=''
            color='t-dark'
            icon='notify'
          />
          <CardData
            title={t('history.cards.openRate')}
            count={openRate.value}
            subtitle='%'
            color='t-dark'
            icon='open-mail'
          />
          <CardData
            title={t('history.cards.monthlyNotifications')}
            count={notificationsThisMonth.value}
            subtitle=''
            color='t-dark'
            icon='0002'
          />
        </CardsPage>
      }
      buttons={
        <ButtonsPage>
          {/*
          <Button
            name='run-cron-button'
            label={t('history.buttons.executeReview')}
            onClick={handleRunCron}
            icon='137'
          />
        */}
        </ButtonsPage>
      }
      modals={
        <>
          {showUpsertModal.value && (
            <HistoryForm
              closed={showUpsertModal.value}
              onClose={() => {
                toggleUpsertModal();
                fetchAll();
              }}
              id={idUpsert.value}
            />
          )}
        </>
      }
    >
      <Table<INotificationListItem>
        data={notifications.value}
        columns={getColumns(onClickAction)}
        showExpandableIcon={false}
        loading={loading.value}
      />
    </SectionPage>
  );
};

export default HistoryNotificationsPage;
