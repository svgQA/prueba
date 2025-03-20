import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.ia.base;
export const MODAL_SETTING_IA: IModalSidebarMenu = {
  label: 'IA',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  // show: true,
  menus: [
    {
      icon: '202',
      label: 'IA',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.ia.ia.base,
      id: 'ia',
      show: true,
    },
  ],
};
