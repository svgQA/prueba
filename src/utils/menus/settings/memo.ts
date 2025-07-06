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
      label: 'm_novelty',
      description: 'd_novelty',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.novelty.base,
      id: 'novelty',
      show: true,
    },
    {
      icon: '115',
      label: 'm_predefined',
      description: 'd_predefined',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.predefined.base,
      id: 'predefined',
      show: true,
    },
    {
      icon: '115',
      label: 'm_resource',
      description: 'd_resource',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.resource.base,
      id: 'resource',
      show: true,
    },
  ],
};
