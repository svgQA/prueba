import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_GENERAL: IModalSidebarMenu = {
  label: 'general',
  menus: [
    {
      icon: '007',
      label: 'user',
      description: 'Update user Information',
      to: PAGES_LIST_ROUTER.dashboard.setting.user.to,
      id: 'user',
    },
    {
      icon: '088',
      label: 'company',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.company.to,
      id: 'company',
    },
    {
      icon: '092',
      label: 'modules',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.modules.to,
      id: 'modules',
    },
    {
      icon: '160',
      label: 'integraciones',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.integration.to,
      id: 'integrations',
    },
    {
      icon: '195',
      label: 'App Voxline',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.voxline.to,
      id: 'voxline',
    },
    {
      icon: '117',
      label: 'App Solo Por',
      description: 'Company',
      to: PAGES_LIST_ROUTER.dashboard.setting.solo.to,
      id: 'solopor',
    },
  ],
};
