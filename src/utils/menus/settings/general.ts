import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.setting.base;
export const MODAL_SETTING_GENERAL: IModalSidebarMenu = {
  label: 'general',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  settings: PAGES_LIST_ROUTER.dashboard.setting.setting.settings,
  show: true,
  menus: [
    {
      icon: '007',
      label: 'user',
      description: 'Update user Information',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.user.base,
      id: 'user',
      show: true,
    },
    {
      icon: '088',
      label: 'company',
      description: 'Company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.company.base,
      id: 'company',
      show: true,
    },
    {
      icon: '092',
      label: 'modules',
      description: 'Company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.modules.base,
      id: 'modules',
    },
    {
      icon: '160',
      label: 'integraciones',
      description: 'Company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.integration.base,
      id: 'integrations',
    },
    {
      icon: '195',
      label: 'App Voxline',
      description: 'Company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.voxline.base,
      id: 'voxline',
    },
    {
      icon: '117',
      label: 'App Solo Por',
      description: 'Company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.solo.base,
      id: 'solopor',
    },
  ],
};
