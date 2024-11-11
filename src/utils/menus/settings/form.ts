import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_FORM: IModalSidebarMenu = {
  label: 'formularios',
  menus: [
    {
      icon: '094',
      label: 'crear',
      description: 'Payment',
      to: PAGES_LIST_ROUTER.dashboard.forms.create.to,
      id: 'form-create',
    },
    {
      icon: '028',
      label: 'analytic',
      description: 'Payment',
      to: PAGES_LIST_ROUTER.dashboard.forms.analytic.to,
      id: 'form-analytic',
    },
  ],
};
