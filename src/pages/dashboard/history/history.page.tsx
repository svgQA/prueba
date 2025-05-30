import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards';
import { INotificationListItem } from '@/types/notification/INotificationTypes';
import { ToastManager } from '@/utils/toast/toast-manager';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { getColumns } from './components/history.columns';
import { useTranslation } from 'react-i18next';
import { NotificationHistoryService } from '@/services';

export const HistoryNotificationsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const notifications = useSignal<INotificationListItem[]>([]);
  const totalNotifications = useSignal<number>(0);
  const openRate = useSignal<number>(0);
  const notificationsThisMonth = useSignal<number>(0);
  const loading = useSignal<boolean>(false);
  useEffect(() => {
    document.title = t('history.pageTitle');
    fetchAll();
  }, [t]);

  const fetchAll = async () => {
    await Promise.all([fetchNotifications(), fetchDashboardStats()]);
  };

  const fetchNotifications = async () => {
    try {
      loading.value = true;
      const res = await NotificationHistoryService.getNotificationList();
      notifications.value = res;
    } catch (error) {
      ToastManager.error(t('history.errors.loadHistory'));
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
      ToastManager.error(t('history.errors.loadStats'));
    }
  };

  /* const handleRunCron = async () => {
    try {
      await NotificationHistoryService.runSchedulerTask();
      ToastManager.success(t('history.success.cronExecuted'));
      await fetchAll();
    } catch (error) {
      ToastManager.error(t('history.errors.cronExecution'));
    }
  }; */

  const onClickAction = (_: {
    id: string;
    type: string;
    action: ROW_ACTIONS;
  }) => {
    // Aquí abres modales, haces navigations, etc.
  };

  return (
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
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
          icon='calendar-days'
        />
      </div>
      {/*       <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <Button
          name='run-cron-button'
          label={t('history.buttons.executeReview')}
          onClick={handleRunCron}
          icon='137'
        />
      </div> */}
      <Table<INotificationListItem>
        data={notifications.value}
        columns={getColumns(onClickAction)}
        pageSize={10}
        showExpandableIcon={false}
        loading={loading.value}
      />
    </Section>
  );
};

export default HistoryNotificationsPage;
