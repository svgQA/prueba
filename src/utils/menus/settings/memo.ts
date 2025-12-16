import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.memo.base;
export const MODAL_SETTING_MEMO: IModalSidebarMenu = {
  label: 'Memo',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  id: 'memo:state',
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.memo.settings,
    label: 'setting',
    id: 'memo:tools:state',
    show: true,
  },
  menus: [
    {
      icon: 'notify', 
      label: 'm_novelty',
      description: 'd_novelty',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.novelty.base,
      id: 'memo:novelties:state',
      show: true,
    },
    {
      icon: '382', 
      label: 'm_predefined',
      description: 'd_predefined',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.predefined.base,
      id: 'memo:predefined:state',
      show: true,
    },
    {
      icon: '022', 
      label: 'm_resource',
      description: 'd_resource',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.memo.resource.base,
      id: 'memo:resources:state',
      show: true,
    },
  ],
};