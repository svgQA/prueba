import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST, PAGES_LIST_ROUTER } from '../pages';

export const MODAL_SIDEBAR_MENUS: IModalSidebarMenu[] = [
  {
    label: 'general',
    menus: [
      {
        icon: 'users',
        label: 'user',
        description: 'User',
        to: PAGES_LIST_ROUTER.dashboard.setting.user.to,
      },
      {
        icon: 'home',
        label: 'company',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.company.to,
      },
      {
        icon: 'apps',
        label: 'modules',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.modules.to,
      },
      {
        icon: 'apps',
        label: 'integraciones',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.integration.to,
      },
      {
        icon: 'gateway',
        label: 'App Voxline',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.voxline.to,
      },
      {
        icon: 'gateway',
        label: 'App Solo Por',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.solo.to,
      },
    ],
  },
  {
    label: 'Security',
    menus: [
      {
        icon: 'dialog',
        label: 'keys',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'users',
        label: 'usuarios',
        description: 'Company',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'users',
        label: 'roles',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'users',
        label: 'groups',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
  {
    label: 'payment',
    menus: [
      {
        icon: 'sales',
        label: 'payment',
        description: 'Payment',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'graph',
        label: 'history',
        description: 'Payment',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
  {
    label: 'formularios',
    menus: [
      {
        icon: 'apps',
        label: 'crear',
        description: 'Payment',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'graph',
        label: 'analytic',
        description: 'Payment',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
  {
    label: 'IoT',
    menus: [
      {
        icon: 'gateway',
        label: 'Devices',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'actuator',
        label: 'IoT',
        description: 'IoT',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'dialog',
        label: 'channels',
        description: 'IoT',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
  {
    label: 'IA',
    menus: [
      {
        icon: 'settings',
        label: 'IA',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
  {
    label: 'Sales',
    menus: [
      {
        icon: 'sales',
        label: 'Solo Por',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
  {
    label: 'Asociados',
    menus: [
      {
        icon: 'apps',
        label: 'Lista',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
      {
        icon: 'settings',
        label: 'recursos',
        description: 'Devices',
        to: PAGES_LIST.DASHBOARD,
      },
    ],
  },
];
