import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_SHIFT: IModalSidebarMenu = {
  label: 'Shifts',
  menus: [
    {
      icon: '142',
      label: 'Rounds',
      description: 'Rondas',
      to: PAGES_LIST_ROUTER.dashboard.shifts.rounds.to,
      id: 'rounds',
    },
  ],
};
