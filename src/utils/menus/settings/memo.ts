import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.memo.base;
export const MODAL_SETTING_MEMO: IModalSidebarMenu = {
  label: 'Memo',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  menus: [
    {
      icon: '067',
      label: 'Novelty',
      description: 'Novedades',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.novelty.base,
      id: 'novelty',
      show: true,
    },
  ],
};
