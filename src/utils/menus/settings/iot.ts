import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.iot.base;
export const MODAL_SETTING_IOT: IModalSidebarMenu = {
  label: 'g_iot',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '247',
      label: 'm_device',
      description: 'd_device',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.iot.devices.base,
      id: 'iot-devices',
    },
    {
      icon: '246',
      label: 'm_iot',
      description: 'd_iot',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.iot.iot.base,
      id: 'iot',
    },
    {
      icon: '080',
      label: 'm_channel',
      description: 'd_channel',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.iot.channels.base,
      id: 'iot-channels',
    },
  ],
};
