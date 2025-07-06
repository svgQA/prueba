import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.setting.base;
export const MODAL_SETTING_GENERAL: IModalSidebarMenu = {
  label: 'g_general',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  settings: PAGES_LIST_ROUTER.dashboard.setting.setting.settings,
  show: true,
  menus: [
    {
      icon: '007',
      label: 'm_user',
      description: 'd_user',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.user.base,
      id: 'user',
      show: false,
    },
    {
      icon: '088',
      label: 'm_company',
      description: 'd_company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.company.base,
      id: 'company',
      show: true,
    },
    {
      icon: '092',
      label: 'm_module',
      description: 'd_module',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.modules.base,
      id: 'modules',
    },
    {
      icon: '160',
      label: 'm_integration',
      description: 'd_integration',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.integration.base,
      id: 'integrations',
    },
    {
      icon: '195',
      label: 'm_app',
      description: 'd_app',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.voxline.base,
      id: 'tryvoo',
    },
    {
      icon: '117',
      label: 'm_solo',
      description: 'd_solo',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.solo.base,
      id: 'solopor',
    },
  ],
};
