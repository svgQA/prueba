import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.sales.base;
export const MODAL_SETTING_SALES: IModalSidebarMenu = {
  label: 'g_sales',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  id: 'sales:state',
  menus: [
    {
      icon: '167',
      label: 'm_sales',
      description: 'd_sales',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.sales.sales.base,
      id: 'sales:sale:state',
    },
  ],
};
