import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.users.base;
export const MODAL_SETTING_USER: IModalSidebarMenu = {
  label: 'Usuarios',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  settings: PAGES_LIST_ROUTER.dashboard.setting.users.settings.base,
  show: true,
  menus: [
    {
      icon: '142',
      label: 'Areas',
      description: 'Areas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.areas.base,
      id: 'areas',
      show: true,
    },
    {
      icon: '103',
      label: 'Roles',
      description: 'Roles',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.roles.base,
      id: 'roles',
      show: true,
    },
    {
      icon: '064',
      label: 'Groups',
      description: 'Grupos',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.groups.base,
      id: 'groups',
      show: true,
    },
    {
      icon: '092',
      label: 'Password',
      description: 'Contraseña',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.password.base,
      id: 'password',
      show: true,
    },
  ],
};
