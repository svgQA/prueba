import { IMenu } from '@/components/common/utils/interface';
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
    label: 'access',
    to: PAGES_LIST_ROUTER.dashboard.access,
    description: 'Accesos a la aplicación',
    icon: '099',
    id: 'access',
  },
  {
    label: 'Inbox',
    to: PAGES_LIST_ROUTER.dashboard.correspondence,
    description: 'Correspondence',
    icon: '102',
    id: 'correspondencia',
  },
  {
    label: 'users',
    to: PAGES_LIST_ROUTER.dashboard.users,
    description: 'Usuarios de la aplicación',
    icon: '008',
    id: 'users-dashoboar-externo',
  },
  {
    label: 'devices',
    to: PAGES_LIST_ROUTER.dashboard.devices,
    description: 'este es',
    icon: '144',
    id: 'device',
  },
];
