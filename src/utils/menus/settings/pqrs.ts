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
    {
      icon: '387',
      label: 'm_priorities',
      description: 'd_priorities',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.pqrs.priorities.base,
      show: true,
      id: 'pqrs:priorities:state',
    },
    {
      icon: '145',
      label: 'm_resource',
      description: 'd_resource',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.pqrs.resources.base,
      show: true,
      id: 'pqrs:resources:state',
    },
  ],
};
