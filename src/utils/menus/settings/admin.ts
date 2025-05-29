import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const BASE_ADMIN = PAGES_LIST_ROUTER.dashboard.setting.admin.base;
export const MODAL_SETTING_ADMIN: IModalSidebarMenu = {
  label: 'admin',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  menus: [
    {
      icon: '023',
      label: 'analytic',
      description: 'analytic',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.analytic.base,
      id: 'analytic',
      show: false,
    },
    {
      icon: '054',
      label: 'database',
      description: 'database',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.database.base,
      id: 'database',
      show: false,
    },
    {
      icon: '088',
      label: 'Tenants',
      description: 'tenant',
      base: BASE_ADMIN,
      to: PAGES_LIST_ROUTER.dashboard.setting.admin.tenant.base,
      id: 'tenant',
      show: true,
    },
  ],
};
