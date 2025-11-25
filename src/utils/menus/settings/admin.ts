import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const BASE_ADMIN = PAGES_LIST_ROUTER.dashboard.setting.admin.base;
export const MODAL_SETTING_ADMIN: IModalSidebarMenu = {
  label: 'g_admin',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: false,
  id: 'admin:state',
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.admin.settings,
    label: 'setting',
    id: 'admin:tools:state',
    show: true,
  },
  menus: [
    {
      icon: '023',
      label: 'm_analytic',
      description: 'd_analytic',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.analytic.base,
      id: 'admin:analytic:state',
      show: false,
    },
    {
      icon: '054',
      label: 'm_database',
      description: 'd_database',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.database.base,
      id: 'admin:database:state',
      show: false,
    },
    {
      icon: '088',
      label: 'm_tenant',
      description: 'd_tenant',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.tenant.base,
      id: 'admin:tenant:state',
      show: false,
    },
  ],
};
