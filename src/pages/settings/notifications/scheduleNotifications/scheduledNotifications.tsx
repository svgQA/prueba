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
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/store/slices';

export const ScheduledNotificationsPage: FunctionComponent = () => {
  const notifications = useSignal<INotificationScheduledItem[]>([]);
  const [_, navigate] = useLocation();
  const loading = useSignal<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    document.title = t('p_programmed');
  }, []);

  const { selectedCompany } = useUserStore();
  useEffect(() => {
    // TODO: Para cargar cuando se haya seleccionado una empresa, sino falla por tenant
    if (selectedCompany) {
      fetchNotifications();
    }
  }, [selectedCompany, location]);

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
    <Section className='pt-2'>
      <div className='py-2 flex flex-row justify-between items-center overflow-visible xl:absolute relative z-20'>
        <div className='flex flex-row items-center justify-between'>
          <Button
            name='button-create-scheduled-notification'
            label='new'
            icon='039'
            onClick={() => redirect()}
            className='px-6 py-2 text-sm font-medium rounded md:text-base h-fit items-center justify-center inline-flex bg-primary text-white border-none'
          />
        </div>
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
