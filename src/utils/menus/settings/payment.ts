import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_PAYMENT: IModalSidebarMenu = {
  label: 'payment',
  menus: [
    {
      icon: '056',
      label: 'payment',
      description: 'Payment',
      to: PAGES_LIST_ROUTER.dashboard.payment.payment.to,
      id: 'payment',
    },
    {
      icon: '029',
      label: 'history',
      description: 'Payment',
      to: PAGES_LIST_ROUTER.dashboard.payment.history.to,
      id: 'history',
    },
  ],
};
