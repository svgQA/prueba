import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.asociate.base;
export const MODAL_SETTING_ASSOCIATE: IModalSidebarMenu = {
  label: 'Asociados',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    // {
    //   icon: '096',
    //   label: 'Listas',
    //   description: 'Devices',
    //   base,
    //   to: PAGES_LIST_ROUTER.dashboard.setting.asociate.list.base,
    //   id: 'lists',
    // },
    {
      icon: '168',
      label: 'recursos',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.asociate.resource.base,
      id: 'resources',
    },
  ],
};
