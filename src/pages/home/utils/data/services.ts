import { ISectionProps } from '../types';

import HomeService1 from '@/assets/image/home-service-1.svg';
import HomeService2 from '@/assets/image/home-service-2.svg';
import HomeService3 from '@/assets/image/home-service-3.svg';
import HomeService4 from '@/assets/image/home-service-4.svg';

export const tryvoo_services: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'services.items.monitoring.title',
    subtitleKey: 'services.items.monitoring.subtitle',
    image: HomeService1,
  },
  {
    id: 2,
    titleKey: 'services.items.offline.title',
    subtitleKey: 'services.items.offline.subtitle',
    image: HomeService2,
  },
  {
    id: 3,
    titleKey: 'services.items.ai.title',
    subtitleKey: 'services.items.ai.subtitle',
    image: HomeService3,
  },
  {
    id: 4,
    titleKey: 'services.items.integration.title',
    subtitleKey: 'services.items.integration.subtitle',
    image: HomeService4,
  },
];
