import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.notification.base;
export const MODAL_SETTING_NOTIFICATIONS: IModalSidebarMenu = {
  label: 'g_notification',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  id: 'notification:state',
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.notification.settings,
    label: 'setting',
    id: 'notification:tools:state',
    show: true,
  },
  menus: [
    /*
    {
      icon: '049',
      label: 'm_programmed',
      description: 'd_programmed',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.notification.scheduled.base,
      show: true,
      id: 'notification:scheduled:state',
    },
    */
    {
      icon: '151',
      label: 'm_template',
      description: 'd_template',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.notification.template.base,
      id: 'notification:template:state',
      show: true,
    },
  ],
};
