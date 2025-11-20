import { ISectionProps } from '../types';
import HomeService1 from '@/assets/image/home-service-1.svg';
import HomeService2 from '@/assets/image/home-service-2.svg';
import HomeService3 from '@/assets/image/home-service-3.svg';
import HomeService4 from '@/assets/image/home-service-4.svg';

export const tryvoo_carousel: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'h_carousel_monitor_title',
    subtitleKey: 'h_carousel_monitor_subtitle',
    image: HomeService1,
  },
  {
    id: 2,
    titleKey: 'h_carousel_offline_title',
    subtitleKey: 'h_carousel_offline_subtitle',
    image: HomeService2,
  },
  {
    id: 3,
    titleKey: 'h_carousel_ai_title',
    subtitleKey: 'h_carousel_ai_subtitle',
    image: HomeService3,
  },
  {
    id: 4,
    titleKey: 'h_carousel_integration_title',
    subtitleKey: 'h_carousel_integration_subtitle',
    image: HomeService4,
  },
];
