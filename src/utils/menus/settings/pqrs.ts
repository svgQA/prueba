import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.pqrs.base;
export const MODAL_SETTING_PQRS: IModalSidebarMenu = {
  label: 'g_pqrs',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  id: 'pqrs:state',
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.pqrs.settings,
    label: 'setting',
    id: 'pqrs:tools:state',
    show: true,
  },
  menus: [
    {
      icon: '386',
      label: 'm_stage',
      description: 'd_stages',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.pqrs.stages.base,
      show: true,
      id: 'pqrs:prompts:state',
    },
  ],
};
