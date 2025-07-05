import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const BASE_ADMIN = PAGES_LIST_ROUTER.dashboard.setting.admin.base;
export const MODAL_SETTING_ADMIN: IModalSidebarMenu = {
  label: 'g_admin',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: false,
  menus: [
    {
      icon: '023',
      label: 'm_analytic',
      description: 'd_analytic',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.analytic.base,
      id: 'analytic',
      show: false,
    },
    {
      icon: '054',
      label: 'm_database',
      description: 'd_database',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.database.base,
      id: 'database',
      show: false,
    },
    {
      icon: '088',
      label: 'm_tenant',
      description: 'd_tenant',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.tenant.base,
      id: 'tenant',
      show: false,
    },
  ],
};
