import { ISectionProps } from '../types';

import HomeService1 from '@/assets/image/home-service-1.svg';
import HomeService2 from '@/assets/image/home-service-2.svg';
import HomeService3 from '@/assets/image/home-service-3.svg';
import HomeService4 from '@/assets/image/home-service-4.svg';

export const tryvoo_services: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'i_services_monitoring_title',
    subtitleKey: 'i_services_monitoring_subtitle',
    image: HomeService1,
  },
  {
    id: 2,
    titleKey: 'i_services_offline_title',
    subtitleKey: 'i_services_offline_subtitle',
    image: HomeService2,
  },
  {
    id: 3,
    titleKey: 'i_services_ai_title',
    subtitleKey: 'i_services_ai_subtitle',
    image: HomeService3,
  },
  {
    id: 4,
    titleKey: 'i_services_integration_title',
    subtitleKey: 'i_services_integration_subtitle',
    image: HomeService4,
  },
];
