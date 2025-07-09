import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.ia.base;
export const MODAL_SETTING_IA: IModalSidebarMenu = {
  label: 'g_ia',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  id: 'ai:state',
  menus: [
    {
      icon: '202',
      label: 'm_ia',
      description: 'd_ia',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.ia.ia.base,
      id: 'ia:setting:state',
      show: true,
    },
  ],
};
