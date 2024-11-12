import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.payment.base;
export const MODAL_SETTING_PAYMENT: IModalSidebarMenu = {
  label: 'payment',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '056',
      label: 'payment',
      description: 'Payment',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.payment.payment.base,
      id: 'payment',
    },
    {
      icon: '029',
      label: 'history',
      description: 'Payment',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.payment.history.base,
      id: 'history',
    },
  ],
};
