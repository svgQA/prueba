import { IModalSidebarMenu } from '@/components/compose/modal';
import { PAGES_LIST_ROUTER } from '@/utils/routing';

const base = PAGES_LIST_ROUTER.dashboard.setting.trybook.base;
export const MODAL_SETTING_TRYBOOK: IModalSidebarMenu = {
    label: 'g_trybook',
    base: PAGES_LIST_ROUTER.dashboard.setting.base,
    show: true,
    id: 'trybook:state',
    menus: [
        {
            icon: '328',
            label: 'm_residence',
            description: 'd_residence',
            base,
            to: PAGES_LIST_ROUTER.dashboard.setting.trybook.residences.base,
            show: true,
            id: 'trybook:residence:state',
        },
        {
            icon: '160',
            label: 'm_commonzone',
            description: 'd_commonzone',
            base,
            to: PAGES_LIST_ROUTER.dashboard.setting.trybook.commonZones.base,
            show: true,
            id: 'trybook:commonzone:state',
        },
         {
            icon: '190',    
            label: 'm_commonslot',
            description: 'd_commonslot',
            base,
            to: PAGES_LIST_ROUTER.dashboard.setting.trybook.commonSlots.base,
            show: true,
            id: 'trybook:commonslot:state',
        }
    ],
};
