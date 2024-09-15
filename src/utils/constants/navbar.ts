import { IMenu } from '@/components/common/interface';
import { PAGES_LIST } from './pages';

export const NAVBAR_MENUS: IMenu[] = [
  // {
  //   label: 'Services',
  //   description: '123',
  //   to: PAGES_LIST.SERVICES,
  //   button: true,
  // },
  {
    label: 'Signin',
    description: '123',
    to: PAGES_LIST.SIGNIN,
    button: true,
  },
  {
    label: 'Signup',
    description: '123',
    to: PAGES_LIST.SIGNUP,
    button: true,
  },
  {
    label: 'Dashboard',
    description: '123',
    to: PAGES_LIST.DASHBOARD,
  },
];
