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
  ],
};
