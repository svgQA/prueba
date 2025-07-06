import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.shifts.base;
export const MODAL_SETTING_NOTIFICATIONS: IModalSidebarMenu = {
  label: 'g_notification',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  menus: [
    {
      icon: '050',
      label: 'm_programmed',
      description: 'd_programmed',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications
        .scheduledNotification.base,
      show: true,
      id: 'scheduled-notifications',
    },
    {
      icon: '040',
      label: 'm_template',
      description: 'd_template',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.notifications.templateNotification
        .base,
      id: 'template-notifications',
      show: true,
    },
  ],
};
