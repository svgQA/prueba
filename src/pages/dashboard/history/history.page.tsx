import { FunctionComponent } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { Section } from '@/components/common/section/section';
import { Table } from '@/components/common/table/table';
import { Button } from '@/components/common/button/button';
import { NotificationHistoryServiceFront } from '@/services/historyNotification';
import { INotificationHistoryItem } from '@/types/notification/INotificationTypes';
import { columns } from './components/history.columns';
import { useSignal } from '@preact/signals';
import { CardData } from '@/components/compose/cards';

type ViewStatus = 'all' | 'read' | 'unread';

export const HistoryNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationHistoryItem[]>([]);
  const viewStatus = useSignal<ViewStatus>('all');
  const isLoading = useSignal<boolean>(false);

  useEffect(() => {
    document.title = 'VX - History Notifications Service';
    fetchNotifications();
  }, [viewStatus.value]);

  const fetchNotifications = async () => {
    isLoading.value = true;
    try {
      const userId = 1; // Esto debe venir de tu auth o estado global
      const response = await NotificationHistoryServiceFront.getByUser(
        userId,
        viewStatus.value
      );
      notifications.value = response;
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleMarkAsRead = async (notification: INotificationHistoryItem) => {
    try {
      // Validate required notification ID
      if (!notification?.scheduledNotificationId) {
        console.warn('Cannot mark as read: Missing scheduledNotificationId');
        return;
      }

      // Mark notification as read
      await NotificationHistoryServiceFront.markAsRead(
        notification.userId,
        notification.scheduledNotificationId
      );

      // Refresh notifications list
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const buttonMenu = useMemo(
    () => (
      <div className='flex gap-2'>
        <Button
          name='all-notifications'
          label='Todas'
          className={viewStatus.value === 'all' ? 'bg-primary-opacity p-2' : ''}
          onClick={() => (viewStatus.value = 'all')}
        />
        <Button
          name='read-notifications'
          label='Leídas'
          className={
            viewStatus.value === 'read' ? 'bg-primary-opacity p-2' : ''
          }
          onClick={() => (viewStatus.value = 'read')}
        />
        <Button
          name='unread-notifications'
          label='No Leídas'
          className={
            viewStatus.value === 'unread' ? 'bg-primary-opacity p-2' : ''
          }
          onClick={() => (viewStatus.value = 'unread')}
        />
        <Button
          name='reload-notifications'
          label='Recargar'
          icon='316'
          onClick={fetchNotifications}
        />
      </div>
    ),
    [viewStatus.value]
  );

  return (
    <Section padding>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Historial de notificaciones</h2>
        {buttonMenu}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <CardData
          title='Turnos de notificaciones'
          count={0}
          subtitle=''
          color='t-dark'
          icon='054'
        />

        <CardData
          title='Tasa de apertura'
          count={0}
          subtitle=''
          color='t-dark'
          icon='052'
        />

        <CardData
          title='Notificaciones del mes'
          count={0}
          subtitle=''
          color='t-dark'
          icon='015'
        />
      </div>

      <Table<INotificationHistoryItem>
        data={notifications.value}
        columns={columns({ onMarkAsRead: handleMarkAsRead })}
        pageSize={10}
        showExpandableIcon={false}
      />
    </Section>
  );
};
