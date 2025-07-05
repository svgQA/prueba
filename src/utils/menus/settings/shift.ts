import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.shifts.base;
export const MODAL_SETTING_SHIFT: IModalSidebarMenu = {
  label: 'g_shift',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  settings: PAGES_LIST_ROUTER.dashboard.setting.shifts.settings,
  show: true,
  menus: [
    {
      icon: '142',
      label: 'm_round',
      description: 'd_round',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.base,
      id: 'rounds',
      show: true,
    },
    {
      icon: '103',
      label: 'm_place',
      description: 'd_place',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.places.base,
      id: 'places',
      show: true,
    },
    {
      icon: '064',
      label: 'm_contract',
      description: 'd_contract',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projects.base,
      id: 'contracts',
      show: true,
    },
    {
      icon: '092',
      label: 'm_task',
      description: 'd_task',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.base,
      id: 'tasks',
      show: true,
    },
    {
      icon: '050',
      label: 'm_schedule',
      description: 'd_schedule',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.base,
      id: 'schedule',
      show: true,
    },
    {
      icon: '191',
      label: 'm_shift',
      description: 'd_shift',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.activity.base,
      id: 'shifts',
    },
    {
      icon: '090',
      label: 'm_service',
      description: 'd_service',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.service.base,
      id: 'services',
      show: true,
    },
  ],
};
