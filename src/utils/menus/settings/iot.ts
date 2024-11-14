import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.iot.base;
export const MODAL_SETTING_IOT: IModalSidebarMenu = {
  label: 'IoT',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  menus: [
    {
      icon: '247',
      label: 'Devices',
      description: 'Devices',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.iot.devices.base,
      id: 'iot-devices',
    },
    {
      icon: '246',
      label: 'IoT',
      description: 'IoT',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.iot.iot.base,
      id: 'iot',
    },
    {
      icon: '080',
      label: 'channels',
      description: 'IoT',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.iot.channels.base,
      id: 'iot-channels',
    },
  ],
};
