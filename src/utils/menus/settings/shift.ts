import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.shifts.base;
export const MODAL_SETTING_SHIFT: IModalSidebarMenu = {
  label: 'Shifts',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '142',
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
      icon: '240',
      label: 'Shifts',
      description: 'Rondas',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.shiftsCreate.base,
      id: 'shifts',
    },
    {
      icon: '064',
      label: 'Projects',
      description: 'Proyectos',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.projects.base,
      id: 'projects',
    },
    {
      icon: '067',
      label: 'Novelty',
      description: 'Novedades',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.shifts.novelty.base,
      id: 'projects',
    },
  ],
};
