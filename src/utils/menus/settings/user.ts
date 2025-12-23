import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.users.base;
export const MODAL_SETTING_USER: IModalSidebarMenu = {
  label: 'g_user',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.users.settings,
    label: 'setting',
    id: 'users:tools:state',
    show: true,
  },
  show: true,
  id: 'user:state',
  menus: [
    {
      icon: '435',
      label: 'm_area',
      description: 'd_area',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.areas.base,
      id: 'user:areas:state',
      show: true,
    },
    {
      icon: '172',
      label: 'm_role',
      description: 'd_role',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.roles.base,
      id: 'user:roles:state',
      show: true,
    },
    {
      icon: '013',
      label: 'm_group',
      description: 'd_group',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.groups.base,
      id: 'user:groups:state',
      show: false,
    },
    {
      icon: '196',
      label: 'm_password',
      description: 'd_password',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.password.base,
      id: 'user:password:state',
      show: true,
    },
    {
      icon: '007',
      label: 'm_client',
      description: 'd_client',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.users.clients.base,
      id: 'user:client:state',
      show: true,
    },
  ],
};
