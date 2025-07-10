import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.security.base;
export const MODAL_SETTING_SECURITY: IModalSidebarMenu = {
  label: 'g_security',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  id: 'security:state',
  menus: [
    {
      icon: '087',
      label: 'm_key',
      description: 'd_key',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.keys.base,
      id: 'security:keys:state',
      show: false,
    },
    {
      icon: '007',
      label: 'm_user',
      description: 'd_user',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.users.base,
      id: 'security:users:state',
    },
    {
      icon: '161',
      label: 'm_role',
      description: 'd_role',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.roles.base,
      id: 'security:roles:state',
    },
    {
      icon: '189',
      label: 'm_group',
      description: 'd_group',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.security.groups.base,
      id: 'security:groups:state',
      show: true,
    },
  ],
};
