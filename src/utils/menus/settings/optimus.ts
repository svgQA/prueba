import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.optimus.base;
export const MODAL_SETTING_OPTIMUS: IModalSidebarMenu = {
  label: 'Optimus',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '168',
      label: 'recursos',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.optimus.resource.base,
      id: 'resources',
    },
  ],
};
