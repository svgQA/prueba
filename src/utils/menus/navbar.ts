import { IMenu } from '@/components/common/utils/interface';
import { PAGES_LIST_ROUTER } from '../routing';

// Nota: Este array ahora solo define la estructura.
// Los textos se obtendrán de las traducciones usando la clave 'i_navbar_products', etc.
export const NAVBAR_MENUS: IMenu[] = [
  {
    label: 'i_navbar_products', // Clave actualizada para traducción
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'products',
  },
  {
    label: 'i_navbar_about', // Clave actualizada para traducción
    description: '123',
    to: PAGES_LIST_ROUTER.dashboard.base,
    id: 'about',
  },
  {
    label: 'i_navbar_demo', // Clave actualizada para traducción
    description: '123',
    to: PAGES_LIST_ROUTER.demo,
    id: 'demo',
  },
  // {
  //   label: 'i_navbar_signin', // Clave actualizada para traducción
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
