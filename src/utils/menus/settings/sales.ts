import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_SALES: IModalSidebarMenu = {
  label: 'Sales',
  menus: [
    {
      icon: '167',
      label: 'Solo Por',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.sales.sales.to,
      id: 'solopor-sales',
    },
  ],
};
