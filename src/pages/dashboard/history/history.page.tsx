import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button'; // 🔥 importamos el botón
import { columns } from './components/history.columns';
import { NotificationHistoryServiceFront } from '@/services/historyNotification';
import { INotificationListItem } from '@/types/notification/INotificationTypes';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const HistoryNotificationsPage: FunctionComponent = () => {
  const { t } = useTranslation();
  const notifications = useSignal<INotificationListItem[]>([]);
  const totalNotifications = useSignal<number>(0);
  const openRate = useSignal<number>(0);
  const notificationsThisMonth = useSignal<number>(0);

  useEffect(() => {
    document.title = t('history.pageTitle');
    fetchAll();
  }, [t]);

  const fetchAll = async () => {
    await Promise.all([fetchNotifications(), fetchDashboardStats()]);
  };

  const fetchNotifications = async () => {
    try {
      const res = await NotificationHistoryServiceFront.getNotificationList();
      notifications.value = res;
    } catch (error) {
      toast.error(t('history.errors.loadHistory'));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const stats = await NotificationHistoryServiceFront.getDashboardData();
      totalNotifications.value = stats.totalNotifications;
      openRate.value = stats.openRate;
      notificationsThisMonth.value = stats.notificationsOfMonth;
    } catch (error) {
      toast.error(t('history.errors.loadStats'));
    }
  };

  const handleRunCron = async () => {
    try {
      await NotificationHistoryServiceFront.runSchedulerTask();
      toast.success(t('history.success.cronExecuted'));
      await fetchAll();
    } catch (error) {
      toast.error(t('history.errors.cronExecution'));
    }
  };

  return (
    <Section padding>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title={t('history.cards.notificationShifts')}
          count={totalNotifications.value}
          subtitle=''
          color='t-dark'
          icon='054'
        />
        <CardData
          title={t('history.cards.openRate')}
          count={openRate.value}
          subtitle='%'
          color='t-dark'
          icon='052'
        />
        <CardData
          title={t('history.cards.monthlyNotifications')}
          count={notificationsThisMonth.value}
          subtitle=''
          color='t-dark'
          icon='015'
        />
      </div>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <Button
          name='run-cron-button'
          label={t('history.buttons.executeReview')}
          className='bg-primary text-white hover:bg-primary-opacity p-2'
          onClick={handleRunCron}
        />
      </div>
      <Table<INotificationListItem>
        data={notifications.value}
        columns={columns()}
        pageSize={10}
        showExpandableIcon={false}
      />
    </Section>
  );
};

export default HistoryNotificationsPage;
