import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.asociate.base;
export const MODAL_SETTING_ASSOCIATE: IModalSidebarMenu = {
  label: 'g_associate',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  id: 'asociate:state',
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.asociate.settings,
    label: 'setting',
    id: 'asociate:tools:state',
    show: true,
  },
  menus: [
    {
      icon: '096',
      label: 'm_resource',
      description: 'd_resource',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.asociate.resources.base,
      id: 'asociate:resource:state',
    },
  ],
};
