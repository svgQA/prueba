import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.payment.base;
export const MODAL_SETTING_PAYMENT: IModalSidebarMenu = {
  label: 'g_payment',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  id: 'payment:state',
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.payment.settings,
    label: 'setting',
    id: 'payment:tools:state',
    show: true,
  },
  menus: [
    {
      icon: '056',
      label: 'm_payment',
      description: 'd_payment',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.payment.payment.base,
      id: 'payment:payment:state',
    },
    {
      icon: '029',
      label: 'm_history',
      description: 'd_history',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.payment.history.base,
      id: 'payment:history:state',
    },
  ],
};
