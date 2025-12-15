import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.setting.base;
export const MODAL_SETTING_GENERAL: IModalSidebarMenu = {
  label: 'g_general',
  base: PAGES_LIST_ROUTER.dashboard.setting.base,
  setting: {
    to: PAGES_LIST_ROUTER.dashboard.setting.setting.settings,
    label: 'setting',
    id: 'general:tools:state',
    show: true,
  },
  show: true,
  id: 'general:state',
  menus: [
    {
      icon: '006', // 👤 Usuario (Consistencia con formularios)
      label: 'm_user',
      description: 'd_user',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.user.base,
      id: 'general:user:state',
      show: false,
    },
    {
      icon: '327', // 🏢 Compañía (Edificio)
      label: 'm_company',
      description: 'd_company',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.company.base,
      id: 'general:company:state',
      show: true,
    },
    {
      icon: '142', // 🔀 Webhook (Ruta/Conexión)
      label: 'm_webhook',
      description: 'd_webhook',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.webhook.base,
      id: 'general:webhook:state',
      show: true,
    },
    {
      icon: '109', // ▦ Módulos (Cuadrícula)
      label: 'm_module',
      description: 'd_module',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.modules.base,
      id: 'general:modules:state',
    },
    {
      icon: '160', // 🧩 Integración (Puzzle/Conexión)
      label: 'm_integration',
      description: 'd_integration',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.integration.base,
      id: 'general:integration:state',
    },
    {
      icon: '195', // 📱 App (Móvil/Dispositivo)
      label: 'm_app',
      description: 'd_app',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.voxline.base,
      id: 'general:tryvoo:state',
    },
    {
      icon: '117', // 🖥️ Solo (Monitor/Pantalla)
      label: 'm_solo',
      description: 'd_solo',
      base,
      to: PAGES_LIST_ROUTER.dashboard.setting.setting.solo.base,
      id: 'general:solopor:state',
    },
  ],
};