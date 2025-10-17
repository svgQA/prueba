export interface MenuItem {
  id: string;
  label: string;
  description: string;
  subItems?: { id: string; label: string }[];
  showSubmenu?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: 'servicios',
    label: 'Servicios',
    description:
      'Explora nuestra amplia gama de servicios diseñados para impulsar tu negocio.',
    subItems: [
      { id: 'servicio1', label: 'Servicio 1' },
      { id: 'servicio2', label: 'Servicio 2' },
      { id: 'servicio3', label: 'Servicio 3' },
    ],
    showSubmenu: false,
  },
  {
    id: 'planes-y-precios',
    label: 'Planes y Precios',
    description:
      'Descubre nuestros planes flexibles y precios competitivos adaptados a tus necesidades.',
    subItems: [
      { id: 'plan-basico', label: 'Plan Básico' },
      { id: 'plan-pro', label: 'Plan Pro' },
      { id: 'plan-enterprise', label: 'Plan Enterprise' },
    ],
    showSubmenu: false,
  },
  {
    id: 'aliados',
    label: 'Aliados',
    description:
      'Conoce a nuestros aliados estratégicos que nos ayudan a ofrecer soluciones integrales.',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    description:
      'Descubre cómo hemos ayudado a nuestros clientes a alcanzar el éxito.',
  },
  {
    id: 'politica-seguridad',
    label: 'Política de seguridad',
    description:
      'Infórmate sobre nuestras rigurosas políticas de seguridad para proteger tu información.',
  },
  {
    id: 'politica-datos',
    label: 'Tratamiento de datos',
    description: 'Conoce cómo manejamos y protegemos tus datos personales.',
  },
];
