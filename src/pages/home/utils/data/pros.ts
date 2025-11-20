import { ISectionProps } from '../types';

import HomeWhyTryvooIconAnalitics from '@/assets/image/home-icon-analitics.jpg';
import HomeWhyTryvooIconReason from '@/assets/image/home-icon-reason.jpg';
import HomeWhyTryvooIconPlace from '@/assets/image/home-icon-place.jpg';
import HomeWhyTryvooIconScalar from '@/assets/image/home-icon-scalar.jpg';

export const tryvoo_pros: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'h_pros_manage_title',
    subtitleKey: 'h_pros_manage_subtitle',
    image: HomeWhyTryvooIconAnalitics,
  },
  {
    id: 2,
    titleKey: 'h_pros_ai_title',
    subtitleKey: 'h_pros_ai_subtitle',
    image: HomeWhyTryvooIconReason,
  },
  {
    id: 3,
    titleKey: 'h_pros_offline_title',
    subtitleKey: 'h_pros_offline_subtitle',
    image: HomeWhyTryvooIconPlace,
  },
  {
    id: 4,
    titleKey: 'h_pros_scalability_title',
    subtitleKey: 'h_pros_scalability_subtitle',
    image: HomeWhyTryvooIconScalar,
  },
];
