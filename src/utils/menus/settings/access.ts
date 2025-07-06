import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.access.base;
export const MODAL_SETTING_ACCESS: IModalSidebarMenu = {
  label: 'g_access',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '096',
      label: 'm_resource',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.resource.base,
      id: 'resources',
      show: true,
    },
    {
      icon: '096',
      label: 'm_device',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.sets.base,
      id: 'sets',
      show: true,
    },
    {
      icon: '096',
      label: 'm_place',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.place.base,
      id: 'places',
      show: true,
    },
    {
      icon: '096',
      label: 'm_info',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.information.base,
      id: 'information',
      show: true,
    },
  ],
};
