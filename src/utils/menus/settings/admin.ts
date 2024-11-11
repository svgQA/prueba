import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_ADMIN: IModalSidebarMenu = {
  label: 'admin',
  menus: [
    {
      icon: '023',
      label: 'analytic',
      description: 'analytic',
      to: PAGES_LIST_ROUTER.dashboard.admin.analytic.to,
      id: 'analytic',
    },
    {
      icon: '054',
      label: 'database',
      description: 'database',
      to: PAGES_LIST_ROUTER.dashboard.admin.database.to,
      id: 'database',
    },
    {
      icon: '088',
      label: 'Tenants',
      description: 'tenant',
      to: PAGES_LIST_ROUTER.dashboard.admin.tenant.to,
      id: 'tenant',
    },
  ],
};
