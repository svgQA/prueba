import { IMenu } from '@/components/common/utils/interface';
import { PAGES_LIST_ROUTER } from '../routing';

// TODO: Agregar hacer que el id sea el key
export const SIDEBAR_MENUS: IMenu[] = [
  {
    label: 'memos',
    to: PAGES_LIST_ROUTER.dashboard.memos,
    description: 'este es',
    icon: '077', // '310',
    id: 'memos',
    key: 'memo',
  },
  {
    label: 'shifts',
    to: PAGES_LIST_ROUTER.dashboard.shift,
    description: 'este es',
    icon: '206', // 'user-tasks',
    id: 'shift',
    key: 'shift',
  },
  {
    label: 'inspect',
    to: PAGES_LIST_ROUTER.dashboard.form,
    description: 'este es',
    icon: '064', // 'form',
    id: 'form',
    key: 'form',
  },
  /*
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
  */
  {
    label: 'users',
    to: PAGES_LIST_ROUTER.dashboard.users,
    description: 'Usuarios de la aplicación',
    icon: '188', // 'user',
    id: 'users-dashoboar-externo',
    key: 'user',
  },
  {
    label: 'notifications',
    to: PAGES_LIST_ROUTER.dashboard.history,
    description: 'este es',
    icon: '140', // 'notify',
    id: 'history',
    key: 'notification',
  },
  /* {
    label: 'devices',
    to: PAGES_LIST_ROUTER.dashboard.devices,
    description: 'este es',
    icon: 'devices',
    id: 'device',
  }, */
];
