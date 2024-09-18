// menuItems.ts

export interface MenuItem {
  label: string;
  id: string;
  subItems?: { label: string; id: string }[];
}

export const menuItems: MenuItem[] = [
  {
    label: 'Servicios',
    id: 'servicios',
    subItems: [
      { label: 'Servicio 1', id: 'servicio1' },
      { label: 'Servicio 2', id: 'servicio2' },
      { label: 'Servicio 3', id: 'servicio3' },
    ],
  },
  {
    label: 'Planes y Precios',
    id: 'planes-y-precios',
    subItems: [
      { label: 'Plan Básico', id: 'plan-basico' },
      { label: 'Plan Pro', id: 'plan-pro' },
      { label: 'Plan Enterprise', id: 'plan-enterprise' },
    ],
  },
  {
    label: 'Aliados',
    id: 'aliados',
    subItems: [
      { label: 'Aliado 1', id: 'aliado1' },
      { label: 'Aliado 2', id: 'aliado2' },
    ],
  },
  {
    label: 'Clientes',
    id: 'clientes',
    subItems: [
      { label: 'Cliente 1', id: 'cliente1' },
      { label: 'Cliente 2', id: 'cliente2' },
    ],
  },
  {
    label: 'Política de seguridad',
    id: 'politica-seguridad',
  },
  {
    label: 'Política de tratamiento de datos',
    id: 'politica-datos',
  },
];
