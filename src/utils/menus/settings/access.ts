import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.access.base;
export const MODAL_SETTING_ACCESS: IModalSidebarMenu = {
  label: 'g_access',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  id: 'access:state',
  menus: [
    {
      icon: '096',
      label: 'm_resource',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.resource.base,
      id: 'access:resources:state',
      show: false,
    },
    {
      icon: '096',
      label: 'm_device',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.sets.base,
      id: 'access:devices:state',
      show: false,
    },
    {
      icon: '096',
      label: 'm_place',
      description: 'Places',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.place.base,
      id: 'access:places:state',
      show: false,
    },
    {
      icon: '096',
      label: 'm_info',
      description: 'Information',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.access.information.base,
      id: 'access:information:state',
      show: false,
    },
  ],
};
