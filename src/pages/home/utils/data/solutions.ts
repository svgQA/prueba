import { ISectionProps } from '../types';

import HomeSolution1 from '@/assets/image/home-solution-1.svg';
import HomeSolution2 from '@/assets/image/home-solution-2.svg';
import HomeSolution3 from '@/assets/image/home-solution-3.svg';
import HomeSolution4 from '@/assets/image/home-solution-4.svg';

export const tryvoo_solutions: ISectionProps[] = [
  {
    id: 1,
    title: 'Seguridad',
    subtitle:
      'Gestiona rondas de vigilancia, genera reportes de incidentes y asegura un control completo sobre las actividades de los operarios.',
    image: HomeSolution1,
  },
  {
    id: 2,
    title: 'Logística',
    subtitle:
      'Rastrea vehículos, monitorea entregas y optimiza la asignación de rutas para maximizar la eficiencia.',
    image: HomeSolution2,
  },
  {
    id: 3,
    title: 'Construcción',
    subtitle:
      'Coordina las tareas de los trabajadores en campo, controla los recursos y realiza un seguimiento de los avances del proyecto.',
    image: HomeSolution3,
  },
  {
    id: 4,
    title: 'Salud',
    subtitle:
      'Gestiona a los técnicos de salud, realiza un seguimiento de las visitas domiciliarias y administra las solicitudes en tiempo real.',
    image: HomeSolution4,
  },
];
