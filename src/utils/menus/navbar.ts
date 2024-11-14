import { type IMenu } from '@/components/common/interface';
import { PAGES_LIST_ROUTER } from '../routing';

export const NAVBAR_MENUS: IMenu[] = [
  {
    label: 'Signin',
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'signin',
  },
  {
    label: 'Signup',
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'signup',
  },
];
