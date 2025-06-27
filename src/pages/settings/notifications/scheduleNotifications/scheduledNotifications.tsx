import { FunctionComponent, useEffect } from 'react';
import { Section } from '@/components/common/section/section';
import { Button } from '@/components/common/button/button';
import { useLocation } from 'wouter';
import { useSignal } from '@preact/signals';
import { Table } from '@/components/common/table/table';
import { INotificationScheduledItem } from '@/types/notification/INotificationScheduledItem';
import { getColumns } from './components/scheduled.columns';
import { PAGES_LIST_ROUTER } from '@/utils/routing/router';
import { appendHistory } from '../../store/settings';
import { ROW_ACTIONS } from '@/components/common/table/enum';
import { SchedulerService } from '@/services/notification/schedule';
import { ToastManager } from '@/utils/toast/toast-manager';

export const ScheduledNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationScheduledItem[]>([]);
  const [_, navigate] = useLocation();
  const loading = useSignal<boolean>(false);
  useEffect(() => {
    document.title = 'TR - Notificaciones Programadas';
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    loading.value = true;
    const response = await SchedulerService.getAll('all');
    if (response.getStatus()) {
      notifications.value = response.getMany();
    }
    loading.value = false;
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

  const editScheduled = (id: string) => {
    const menu = {
      to: `${PAGES_LIST_ROUTER.dashboard.setting.notifications.scheduledNotification.update.to.replace(':id', id)}`,
      label: 'update',
      id: 'scheduled-update',
    };
    navigate(menu.to);
    appendHistory(menu);
  };

  const deleteScheduled = async (id: string) => {
    const confirmed = window.confirm(
      '¿Deseas eliminar esta notificación programada?'
    );
    if (!confirmed) return;

    const res = await SchedulerService.deleteScheduledNotification(id);
    if (res.getStatus()) {
      ToastManager.success('Notificación eliminada correctamente');
      fetchNotifications();
    } else {
      ToastManager.error('Error al eliminar la notificación');
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
        columns={getColumns(onClickAction)}
        pageSize={10}
        showExpandableIcon={false}
        loading={loading.value}
      />
    </Section>
  );
};
