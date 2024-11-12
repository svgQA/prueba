import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.forms.base;
export const MODAL_SETTING_FORM: IModalSidebarMenu = {
  label: 'formularios',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '094',
      label: 'crear',
      description: 'Payment',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.create.base,
      id: 'form-create',
    },
    {
      icon: '028',
      label: 'analytic',
      description: 'Payment',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.base,
      id: 'form-analytic',
    },
  ],
};
