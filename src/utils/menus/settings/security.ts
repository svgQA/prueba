import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.security.base;
export const MODAL_SETTING_SECURITY: IModalSidebarMenu = {
  label: 'Security',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  menus: [
    {
      icon: '087',
      label: 'keys',
      description: 'Keys',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.keys.base,
      id: 'keys',
      show: true,
    },
    {
      icon: '007',
      label: 'usuarios',
      description: 'Company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.users.base,
      id: 'users',
    },
    {
      icon: '161',
      label: 'roles',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.roles.base,
      id: 'roles',
    },
    {
      icon: '249',
      label: 'groups',
      description: 'Groups',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.groups.base,
      id: 'groups',
      show: true,
    },
  ],
};
