import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.forms.base;
export const MODAL_SETTING_FORM: IModalSidebarMenu = {
  label: 'formularios',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '094',
      label: 'Forms',
      description: 'Forms',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.form.base,
      id: 'form-create',
    },
    {
      icon: '033',
      label: 'inspect',
      description: 'Inspects',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.inspect.base,
      id: 'form-inspect',
    },
    // {
    //   icon: '028',
    //   label: 'analytic',
    //   description: 'Responses',
    //   base,
    //   to: PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.base,
    //   id: 'form-analytic',
    // },
  ],
};
