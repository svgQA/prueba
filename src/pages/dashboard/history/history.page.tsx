import { FunctionComponent } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { CardData } from '@/components/compose/cards';
import { Button } from '@/components/common/button/button'; // 🔥 importamos el botón
import { columns } from './components/history.columns';
import { NotificationHistoryServiceFront } from '@/services/historyNotification';
import { INotificationHistoryItem, INotificationListItem } from '@/types/notification/INotificationTypes';
import { toast } from 'react-toastify';

const userId = 1; // ⚡ TODO: reemplazar por el usuario autenticado real

export const HistoryNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationListItem[]>([]);
  const totalNotifications = useSignal<number>(0);
  const openRate = useSignal<number>(0);
  const notificationsThisMonth = useSignal<number>(0);

  useEffect(() => {
    document.title = 'VX - Historial de Notificaciones';
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchNotifications(), fetchDashboardStats()]);
  };

  const fetchNotifications = async () => {
    try {
      const res = await NotificationHistoryServiceFront.getNotificationList();
      notifications.value = res;
    } catch (error) {
      toast.error('Error al cargar historial');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const stats = await NotificationHistoryServiceFront.getDashboardData();
      totalNotifications.value = stats.totalNotifications;
      openRate.value = stats.openRate;
      notificationsThisMonth.value = stats.notificationsOfMonth;
    } catch (error) {
      toast.error('Error al cargar estadísticas');
    }
  };

  const handleRunCron = async () => {
    try {
      await NotificationHistoryServiceFront.runSchedulerTask();
      toast.success('Cron ejecutado manualmente 🚀');
      await fetchAll();
    } catch (error) {
      toast.error('Error al ejecutar el cron manualmente');
    }
  };

  return (
    <Section padding>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CardData
          title="Turnos de notificaciones"
          count={totalNotifications.value}
          subtitle=""
          color="t-dark"
          icon="054"
        />
        <CardData
          title="Tasa de apertura"
          count={openRate.value}
          subtitle="%"
          color="t-dark"
          icon="052"
        />
        <CardData
          title="Notificaciones del mes"
          count={notificationsThisMonth.value}
          subtitle=""
          color="t-dark"
          icon="015"
        />
      </div>
      <div className="py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20">
        <Button
          name="run-cron-button"
          label="Ejecutar revisión"
          className="bg-primary text-white hover:bg-primary-opacity p-2"
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
