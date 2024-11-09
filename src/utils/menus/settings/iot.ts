import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

export const MODAL_SETTING_IOT: IModalSidebarMenu = {
  label: 'IoT',
  menus: [
    {
      icon: 'gateway',
      label: 'Devices',
      description: 'Devices',
      to: PAGES_LIST_ROUTER.dashboard.iot.devices.to,
      id: 'iot-devices',
    },
    {
      icon: 'actuator',
      label: 'IoT',
      description: 'IoT',
      to: PAGES_LIST_ROUTER.dashboard.iot.iot.to,
      id: 'iot',
    },
    {
      icon: 'dialog',
      label: 'channels',
      description: 'IoT',
      to: PAGES_LIST_ROUTER.dashboard.iot.channels.to,
      id: 'iot-channels',
    },
  ],
};
