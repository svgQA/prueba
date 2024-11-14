import { type IMenu } from '@/components/common/interface';
import { PAGES_LIST_ROUTER } from '../routing';

export const SIDEBAR_MENUS: IMenu[] = [
  {
    label: 'memos',
    to: PAGES_LIST_ROUTER.dashboard.memos,
    description: 'este es',
    icon: '152',
    id: 'memos',
  },
  {
    label: 'shifts',
    to: PAGES_LIST_ROUTER.dashboard.shift,
    description: 'este es',
    icon: '050',
    id: 'shift',
  },
  {
    label: 'forms',
    to: PAGES_LIST_ROUTER.dashboard.form,
    description: 'este es',
    icon: '091',
    id: 'form',
  },
  {
    label: 'devices',
    to: PAGES_LIST_ROUTER.dashboard.devices,
    description: 'este es',
    icon: '144',
    id: 'device',
  },
];
