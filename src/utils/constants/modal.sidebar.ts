import { type IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from './pages';

export const MODAL_SIDEBAR_MENUS: IModalSidebarMenu[] = [
  {
    label: 'admin',
    menus: [
      {
        icon: 'home',
        label: 'analytic',
        description: 'analytic',
        to: PAGES_LIST_ROUTER.dashboard.admin.analytic.to,
        id: 'analytic',
      },
      {
        icon: 'home',
        label: 'database',
        description: 'database',
        to: PAGES_LIST_ROUTER.dashboard.admin.database.to,
        id: 'database',
      },
      {
        icon: 'home',
        label: 'tenant',
        description: 'tenant',
        to: PAGES_LIST_ROUTER.dashboard.admin.tenant.to,
        id: 'tenant',
      },
    ],
  },
  {
    label: 'general',
    menus: [
      {
        icon: 'users',
        label: 'user',
        description: 'Update user Information',
        to: PAGES_LIST_ROUTER.dashboard.setting.user.to,
        id: 'user',
      },
      {
        icon: 'home',
        label: 'company',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.company.to,
        id: 'company',
      },
      {
        icon: 'apps',
        label: 'modules',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.modules.to,
        id: 'modules',
      },
      {
        icon: 'apps',
        label: 'integraciones',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.integration.to,
        id: 'integrations',
      },
      {
        icon: 'gateway',
        label: 'App Voxline',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.voxline.to,
        id: 'voxline',
      },
      {
        icon: 'gateway',
        label: 'App Solo Por',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.setting.solo.to,
        id: 'solopor',
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
        to: PAGES_LIST_ROUTER.dashboard.security.keys.to,
        id: 'keys',
      },
      {
        icon: 'users',
        label: 'usuarios',
        description: 'Company',
        to: PAGES_LIST_ROUTER.dashboard.security.users.to,
        id: 'users',
      },
      {
        icon: 'users',
        label: 'roles',
        description: 'Devices',
        to: PAGES_LIST_ROUTER.dashboard.security.roles.to,
        id: 'roles',
      },
      {
        icon: 'users',
        label: 'groups',
        description: 'Devices',
        to: PAGES_LIST_ROUTER.dashboard.security.groups.to,
        id: 'groups',
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
        to: PAGES_LIST_ROUTER.dashboard.payment.payment.to,
        id: 'payment',
      },
      {
        icon: 'graph',
        label: 'history',
        description: 'Payment',
        to: PAGES_LIST_ROUTER.dashboard.payment.history.to,
        id: 'history',
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
        to: PAGES_LIST_ROUTER.dashboard.forms.create.to,
        id: 'form-create',
      },
      {
        icon: 'graph',
        label: 'analytic',
        description: 'Payment',
        to: PAGES_LIST_ROUTER.dashboard.forms.analytic.to,
        id: 'form-analytic',
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
        to: PAGES_LIST_ROUTER.dashboard.iot.devices.to,
        id: 'iot-devices',
      },
      {
        icon: 'actuator',
        label: 'IoT',
        description: 'IoT',
        to: PAGES_LIST_ROUTER.dashboard.iot.iot.to,
        id: 'iot',
      },
      {
        icon: 'dialog',
        label: 'channels',
        description: 'IoT',
        to: PAGES_LIST_ROUTER.dashboard.iot.channels.to,
        id: 'iot-channels',
      },
    ],
  },
  {
    label: 'Shifts',
    menus: [
      {
        icon: 'settings',
        label: 'Rounds',
        description: 'Rondas',
        to: PAGES_LIST_ROUTER.dashboard.shifts.rounds.to,
        id: 'rounds',
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
        to: PAGES_LIST_ROUTER.dashboard.ia.ia.to,
        id: 'ia',
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
        to: PAGES_LIST_ROUTER.dashboard.sales.sales.to,
        id: 'solopor-sales',
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
  },
];
