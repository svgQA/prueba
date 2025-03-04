import { IMenu } from '@/components/common/utils/interface';
import { PAGES_LIST_ROUTER } from '../routing';

export const NAVBAR_MENUS: IMenu[] = [
  {
    label: 'Nuestros productos',
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'products',
  },
  {
    label: 'Conocenos',
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'about',
  },
  {
    label: 'Solicita una demo',
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'demo',
  },
  // {
  //   label: 'Signin',
  //   description: '123',
  //   to: PAGES_LIST_ROUTER.dashboard.base,
  //   id: 'signin',
  // },
  // {
  //   label: 'Signup',
  //   description: '123',
  //   to: PAGES_LIST_ROUTER.dashboard.base,
  //   id: 'signup',
  // },
];
