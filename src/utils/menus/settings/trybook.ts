import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.trybook.base;
export const MODAL_SETTING_TRYBOOK: IModalSidebarMenu = {
  label: 'g_trybook',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  id: 'trybook:state',
  setting: {
    to: '/algo/',
    label: 'setting',
    id: 'trybook:tools:state',
    show: true,
  },
  menus: [
    {
      icon: '328',
      label: 'm_residence',
      description: 'd_residence',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.trybook.residences.base,
      show: true,
      id: 'trybook:residence:state',
    },
    {
      icon: '160',
      label: 'm_commonzone',
      description: 'd_commonzone',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.trybook.commonZones.base,
      show: true,
      id: 'trybook:commonzone:state',
    },
    {
      icon: '190',
      label: 'm_commonslot',
      description: 'd_commonslot',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.trybook.commonSlots.base,
      show: true,
      id: 'trybook:commonslot:state',
    },
    {
      icon: '195',
      label: 'm_resourcezone',
      description: 'd_resourcezone',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.trybook.resourceZones.base,
      show: false,
      id: 'trybook:resourcezone:state',
    },
    {
      icon: '386',
      label: 'm_news',
      description: 'd_news',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.trybook.news.base,
      show: true,
      id: 'trybook:notices:state',
    },
    {
      icon: '150',
      label: 'm_access_ban',
      description: 'Access Bans',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.trybook.accessBans.base,
      id: 'trybook:ban:state',
      show: true,
    },
  ],
};
