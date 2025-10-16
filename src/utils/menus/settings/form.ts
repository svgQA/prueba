import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.forms.base;
export const MODAL_SETTING_FORM: IModalSidebarMenu = {
  label: 'g_form',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  show: true,
  id: 'forms:state',
  setting: {
    to: '/algo/',
    label: 'setting',
    id: 'form:tools:state',
    show: true,
  },
  menus: [
    {
      icon: '094',
      label: 'm_form',
      description: 'd_form',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.form.base,
      id: 'forms:form:state',
      show: true,
    },
    // {
    //   icon: '033',
    //   label: 'inspect',
    //   description: 'Inspects',
    //   base,
    //   to: PAGES_LIST_ROUTER.dashboard.setting.forms.inspect.base,
    //   id: 'form-inspect',
    //   show: true,
    // },
    {
      icon: '028',
      label: 'm_analytic',
      description: 'd_analytic',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.analytic.base,
      id: 'forms:analytic:state',
    },
    {
      icon: '094',
      label: 'm_scheduled_reports',
      description: 'd_scheduled_reports',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.forms.report.base,
      id: 'forms:scheduled:state',
      show: true,
    },
  ],
};
