import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.shifts.base;
export const MODAL_SETTING_NOTIFICATIONS: IModalSidebarMenu = {
  label: 'Notificaciones',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  menus: [
    {
      icon: '050',
      label: 'Scheduled',
      description: 'Notificaciones programadas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications
        .scheduledNotification.base,
      id: 'scheduled-notifications',
      show: true,
    },
    {
      icon: '040',
      label: 'Templates',
      description: 'Gestionar plantillas de notificaciones',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification
        .base,
      id: 'template-notifications',
      show: true,
    },
  ],
};
