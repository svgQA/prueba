import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.access.base;
export const MODAL_SETTING_ACCESS: IModalSidebarMenu = {
  label: 'Access',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '096',
      label: 'Resources',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.resource.base,
      id: 'resources',
      show: true,
    },
    {
      icon: '096',
      label: 'Sets',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.sets.base,
      id: 'sets',
      show: true,
    },
    {
      icon: '096',
      label: 'Places',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.place.base,
      id: 'places',
      show: true,
    },
    {
      icon: '096',
      label: 'Information',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.information.base,
      id: 'information',
      show: true,
    },
  ],
};
