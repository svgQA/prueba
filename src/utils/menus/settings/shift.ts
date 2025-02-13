import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.shifts.base;
export const MODAL_SETTING_SHIFT: IModalSidebarMenu = {
  label: 'Shifts',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '141',
      label: 'Rounds',
      description: 'Rondas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.rounds.base,
      id: 'rounds',
    },
    {
      icon: '103',
      label: 'Places',
      description: 'Lugares',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.places.base,
      id: 'places',
    },

    {
      icon: '064',
      label: 'Contracts',
      description: 'Contratos',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projects.base,
      id: 'contracts',
    },
    {
      icon: '255',
      label: 'Tasks',
      description: 'Tareas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.task.base,
      id: 'tasks',
    },
    {
      icon: '049',
      label: 'schedule',
      description: 'Horarios',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.schedule.base,
      id: 'schedule',
    },
    {
      icon: '152',
      label: 'Services',
      description: 'Servicios',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.service.base,
      id: 'services',
    },
    {
      icon: '191',
      label: 'Shifts',
      description: 'Turnos',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.activity.base,
      id: 'shifts',
    },
  ],
};
