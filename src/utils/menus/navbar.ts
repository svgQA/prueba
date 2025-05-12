import { IMenu } from '@/components/common/utils/interface';
import { PAGES_LIST_ROUTER } from '../routing';

// Nota: Este array ahora solo define la estructura.
// Los textos se obtendrán de las traducciones usando la clave 'navbar.products', etc.
export const NAVBAR_MENUS: IMenu[] = [
  {
    label: 'navbar.products', // Clave para traducción
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'products',
  },
  {
    label: 'navbar.about', // Clave para traducción
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'about',
  },
  {
    label: 'navbar.demo', // Clave para traducción
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'demo',
  },
  // {
  //   label: 'navbar.signin', // Clave para traducción
  //   description: '123',
  //   to: PAGES_LIST_ROUTER.dashboard.base,
  //   id: 'signin',
  // },
  // {
  //   label: 'navbar.signup', // Clave para traducción
  //   description: '123',
  //   to: PAGES_LIST_ROUTER.dashboard.base,
  //   id: 'signup',
  // },
];
