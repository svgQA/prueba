import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.shifts.base;
export const MODAL_SETTING_SHIFT: IModalSidebarMenu = {
  label: 'Shifts',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  settings: PAGES_LIST_ROUTER.dashboard.setting.shifts.settings,
  show: true,
  menus: [
    {
      icon: '142',
      label: 'Rounds',
      description: 'Rondas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.base,
      id: 'rounds',
      show: true,
    },
    {
      icon: '103',
      label: 'Places',
      description: 'Lugares',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.places.base,
      id: 'places',
      show: true,
    },
    {
      icon: '064',
      label: 'Contracts',
      description: 'Contratos',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projects.base,
      id: 'contracts',
      show: true,
    },
    {
      icon: '092',
      label: 'Tasks',
      description: 'Tareas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.base,
      id: 'tasks',
      show: true,
    },
    {
      icon: '050',
      label: 'schedule',
      description: 'Horarios',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.base,
      id: 'schedule',
      show: true,
    },
    {
      icon: '191',
      label: 'Shifts',
      description: 'Turnos',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.activity.base,
      id: 'shifts',
    },
    {
      icon: '090',
      label: 'Services',
      description: 'Servicios',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.service.base,
      id: 'services',
      show: true,
    }
  ],
};
