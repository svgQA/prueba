import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_FORM: IModalSidebarMenu = {
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
};
