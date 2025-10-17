import { ISectionProps } from '../types';

import HomeWhyTryvooIconAnalitics from '@/assets/image/home-icon-analitics.jpg';
import HomeWhyTryvooIconReason from '@/assets/image/home-icon-reason.jpg';
import HomeWhyTryvooIconPlace from '@/assets/image/home-icon-place.jpg';
import HomeWhyTryvooIconScalar from '@/assets/image/home-icon-scalar.jpg';

export const tryvoo_pros: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'i_management_title',
    subtitleKey: 'i_management_subtitle',
    image: HomeWhyTryvooIconAnalitics,
  },
  {
    id: 2,
    titleKey: 'i_ai_title',
    subtitleKey: 'i_ai_subtitle',
    image: HomeWhyTryvooIconReason,
  },
  {
    id: 3,
    titleKey: 'i_offline_title',
    subtitleKey: 'i_offline_subtitle',
    image: HomeWhyTryvooIconPlace,
  },
  {
    id: 4,
    titleKey: 'i_scalability_title',
    subtitleKey: 'i_scalability_subtitle',
    image: HomeWhyTryvooIconScalar,
  },
];
