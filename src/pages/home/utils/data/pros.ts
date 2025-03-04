import { ISectionProps } from '../types';

import HomeWhyTryvooIconAnalitics from '@/assets/image/home-icon-analitics.jpg';
import HomeWhyTryvooIconReason from '@/assets/image/home-icon-reason.jpg';
import HomeWhyTryvooIconPlace from '@/assets/image/home-icon-place.jpg';
import HomeWhyTryvooIconScalar from '@/assets/image/home-icon-scalar.jpg';

export const tryvoo_pros: ISectionProps[] = [
  {
    id: 1,
    title: 'Fácil Gestión y Trazabilidad:',
    subtitle:
      '"Control total sobre las operaciones en campo, con visibilidad y seguimiento en tiempo real."',
    image: HomeWhyTryvooIconAnalitics,
  },
  {
    id: 2,
    title: 'Asistencia con IA:',
    subtitle:
      '"Recibe recomendaciones automáticas y soporte para tus operativos directamente en el terreno."',
    image: HomeWhyTryvooIconReason,
  },
  {
    id: 3,
    title: 'Sincronización Offline:',
    subtitle:
      '"Sigue gestionando incluso sin internet, y los datos se sincronizan al restaurar la conexión."',
    image: HomeWhyTryvooIconPlace,
  },
  {
    id: 4,
    title: 'Escalabilidad:',
    subtitle:
      '"Adaptable a cualquier tamaño de empresa o industria, desde la vigilancia hasta la logística."',
    image: HomeWhyTryvooIconScalar,
  },
];
