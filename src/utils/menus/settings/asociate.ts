import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_ASSOCIATE: IModalSidebarMenu = {
  label: 'Asociados',
  menus: [
    {
      icon: '096',
      label: 'Listas',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.asociate.list.to,
      id: 'lists',
    },
    {
      icon: '168',
      label: 'recursos',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.asociate.resource.to,
      id: 'resources',
    },
  ],
};
