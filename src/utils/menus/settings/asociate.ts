import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_ASSOCIATE: IModalSidebarMenu = {
  label: 'Asociados',
  menus: [
    {
      icon: 'apps',
      label: 'Lista',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.asociate.list.to,
      id: 'lists',
    },
    {
      icon: 'settings',
      label: 'recursos',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.asociate.resource.to,
      id: 'resources',
    },
  ],
};
