import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.sales.base;
export const MODAL_SETTING_SALES: IModalSidebarMenu = {
  label: 'Sales',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '167',
      label: 'Solo Por',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.sales.sales.base,
      id: 'solopor-sales',
    },
  ],
};
