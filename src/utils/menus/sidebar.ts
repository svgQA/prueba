import { IMenu } from '@/components/common/utils/interface';
import { PAGES_LIST_ROUTER } from '../routing';

// TODO: Agregar hacer que el id sea el key
export const SIDEBAR_MENUS: IMenu[] = [
  {
    label: 't_memo',
    to: PAGES_LIST_ROUTER.dashboard.memos,
    description: 'd_memo',
    icon: '077', // '310',
    id: 'memo',
    key: 'memo',
  },
  {
    label: 't_shift',
    to: PAGES_LIST_ROUTER.dashboard.shift,
    description: 'd_shift',
    icon: '206', // 'user-tasks',
    id: 'shift',
    key: 'shift',
  },
  {
    label: 't_inspect',
    to: PAGES_LIST_ROUTER.dashboard.form,
    description: 'd_inspect',
    icon: '064', // 'form',
    id: 'form',
    key: 'form',
  },
  {
    label: 't_access',
    to: PAGES_LIST_ROUTER.dashboard.access,
    description: 'd_access',
    icon: '099',
    // id: 'access',
    // key: 'access',
    id: 'shift',
    key: 'shift',
  },
  {
    label: 't_inbox',
    to: PAGES_LIST_ROUTER.dashboard.correspondence,
    description: 'd_inbox',
    icon: '102',
    // id: 'inbox',
    // key: 'inbox',
    id: 'shift',
    key: 'shift',
  },
  {
    label: 't_user',
    to: PAGES_LIST_ROUTER.dashboard.users,
    description: 'd_user',
    icon: '188', // 'user',
    id: 'user',
    key: 'user',
  },
  {
    label: 't_notification',
    to: PAGES_LIST_ROUTER.dashboard.history,
    description: 'd_notification',
    icon: '140', // 'notify',
    id: 'notification',
    key: 'notification',
  },
  /* {
    label: 't_device',
    to: PAGES_LIST_ROUTER.dashboard.devices,
    description: 'd_device',
    icon: 'devices',
    id: 'device',
  }, */
];
