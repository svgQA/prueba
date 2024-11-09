import { type IMenu } from '@/components/common/interface';
import { PAGES_LIST } from '../routing';

export const SIDEBAR_MENUS: IMenu[] = [
  {
    label: 'memos',
    to: PAGES_LIST.HOME,
    description: 'este es',
    icon: 'burguer',
    id: 'memos',
  },
  {
    label: 'shifts',
    to: PAGES_LIST.SHIFTS,
    description: 'este es',
    icon: 'gateway',
    id: 'shift',
  },
  {
    label: 'forms',
    to: PAGES_LIST.FORMS,
    description: 'este es',
    icon: 'graph',
    id: 'form',
  },
  {
    label: 'devices',
    to: PAGES_LIST.DEVICES,
    description: 'este es',
    icon: 'graph',
    id: 'device',
  },
];
