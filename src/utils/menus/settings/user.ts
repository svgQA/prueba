import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.users.base;
export const MODAL_SETTING_USER: IModalSidebarMenu = {
  label: 'g_user',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  settings: PAGES_LIST_ROUTER.dashboard.setting.users.settings.to,
  show: true,
  menus: [
    {
      icon: '142',
      label: 'm_area',
      description: 'd_area',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.areas.base,
      id: 'areas',
      show: true,
    },
    {
      icon: '103',
      label: 'm_role',
      description: 'd_role',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.roles.base,
      id: 'roles',
      show: true,
    },
    {
      icon: '064',
      label: 'm_group',
      description: 'd_grup',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.groups.base,
      id: 'groups',
      show: false,
    },
    {
      icon: '092',
      label: 'm_password',
      description: 'd_password',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.password.base,
      id: 'password',
      show: true,
    },
  ],
};
