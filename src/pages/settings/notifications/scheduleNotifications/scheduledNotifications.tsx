import { FunctionComponent, useEffect } from 'react';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { useLocation } from 'wouter';
import { useSignal } from '@preact/signals';
import { Table } from '@/components/common/table/table';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import { columns } from './components/scheduled.columns';
import { SchedulerServiceFront } from '@/services/schedule';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '../../store/settings';

export const ScheduledNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationScheduledItem[]>([]);
  const isLoading = useSignal(false);
  const [_, navigate] = useLocation();

  useEffect(() => {
    document.title = 'VX - Notificaciones Programadas';
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    isLoading.value = true;
    try {
      const response = await SchedulerServiceFront.getAll('all');
      notifications.value = response.getMany();
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const redirect = () => {
    const menu = {
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications
        .scheduledNotification.create.to,
      label: 'create',
      id: 'scheduled-create',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  return (
    <Section>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <Button
          name='new-scheduled-notification'
          label='+ Nueva Programación'
          className='bg-primary text-white p-2'
          onClick={redirect}
        />
      </div>

      <Table<INotificationScheduledItem>
        data={notifications.value}
        columns={columns()}
        pageSize={10}
        showExpandableIcon={false}
      />
    </Section>
  );
};
