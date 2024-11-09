import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_SECURITY: IModalSidebarMenu = {
  label: 'Security',
  menus: [
    {
      icon: 'dialog',
      label: 'keys',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.security.keys.to,
      id: 'keys',
    },
    {
      icon: 'users',
      label: 'usuarios',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.security.users.to,
      id: 'users',
    },
    {
      icon: 'users',
      label: 'roles',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.security.roles.to,
      id: 'roles',
    },
    {
      icon: 'users',
      label: 'groups',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.security.groups.to,
      id: 'groups',
    },
  ],
};
