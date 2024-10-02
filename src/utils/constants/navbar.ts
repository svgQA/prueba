import { IMenu } from '@/components/common/interface';
import { PAGES_LIST } from './pages';

export const NAVBAR_MENUS: IMenu[] = [
  {
    label: 'Signin',
    description: '123',
    to: PAGES_LIST.DASHBOARD,
    id: 'signin',
  },
  {
    label: 'Signup',
    description: '123',
    to: PAGES_LIST.DASHBOARD,
    id: 'signup',
  },
];
