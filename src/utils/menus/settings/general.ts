import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_GENERAL: IModalSidebarMenu = {
  label: 'general',
  menus: [
    {
      icon: 'users',
      label: 'user',
      description: 'Update user Information',
      to: PAGES_LIST_ROUTER.dashboard.setting.user.to,
      id: 'user',
    },
    {
      icon: 'home',
      label: 'company',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.company.to,
      id: 'company',
    },
    {
      icon: 'apps',
      label: 'modules',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.modules.to,
      id: 'modules',
    },
    {
      icon: 'apps',
      label: 'integraciones',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.integration.to,
      id: 'integrations',
    },
    {
      icon: 'gateway',
      label: 'App Voxline',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.voxline.to,
      id: 'voxline',
    },
    {
      icon: 'gateway',
      label: 'App Solo Por',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.solo.to,
      id: 'solopor',
    },
  ],
};
