import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_IA: IModalSidebarMenu = {
  label: 'IA',
  menus: [
    {
      icon: 'settings',
      label: 'IA',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.ia.ia.to,
      id: 'ia',
    },
  ],
};
