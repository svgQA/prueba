import { ISectionProps } from '../types';
import HomeService1 from '@/assets/image/home-service-1.svg';
import HomeService2 from '@/assets/image/home-service-2.svg';
import HomeService3 from '@/assets/image/home-service-3.svg';
import HomeService4 from '@/assets/image/home-service-4.svg';

export const tryvoo_carousel: ISectionProps[] = [
  {
    id: 1,
    title: 'Monitorio en Tiempo Real',
    subtitle:
      'Visualiza el progreso de las tareas y el estado de los activos con actualizaciones automáticas y basadas en datos en tiempo real.',
    image: HomeService1,
  },
  {
    id: 2,
    title: 'Capacidades Offline',
    subtitle:
      'Los operarios pueden seguir trabajando sin conexión, y todos los datos se sincronizan cuando la conexión a Internet es restaurada.',
    image: HomeService2,
  },
  {
    id: 3,
    title: 'IA y Soporte Virtual',
    subtitle:
      'Tu asistente virtual para resolver problemas en campo, con recomendaciones basadas en los datos que se capturan durante las operaciones.',
    image: HomeService3,
  },
  {
    id: 4,
    title: 'Integración y Personalización',
    subtitle:
      'Fácil integración con herramientas ya existentes y una plataforma que se adapta a las necesidades de cada sector.',
    image: HomeService4,
  },
];
