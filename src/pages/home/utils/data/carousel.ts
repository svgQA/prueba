import { ISectionProps } from '../types';
import HomeService1 from '@/assets/image/home-service-1.svg';
import HomeService2 from '@/assets/image/home-service-2.svg';
import HomeService3 from '@/assets/image/home-service-3.svg';
import HomeService4 from '@/assets/image/home-service-4.svg';

export const tryvoo_carousel: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'carousel.items.monitoring.title',
    subtitleKey: 'carousel.items.monitoring.subtitle',
    image: HomeService1,
  },
  {
    id: 2,
    titleKey: 'carousel.items.offline.title',
    subtitleKey: 'carousel.items.offline.subtitle',
    image: HomeService2,
  },
  {
    id: 3,
    titleKey: 'carousel.items.ai.title',
    subtitleKey: 'carousel.items.ai.subtitle',
    image: HomeService3,
  },
  {
    id: 4,
    titleKey: 'carousel.items.integration.title',
    subtitleKey: 'carousel.items.integration.subtitle',
    image: HomeService4,
  },
];
