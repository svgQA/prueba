import { ISectionProps } from '../types';

import HomeWhyTryvooIconAnalitics from '@/assets/image/home-icon-analitics.jpg';
import HomeWhyTryvooIconReason from '@/assets/image/home-icon-reason.jpg';
import HomeWhyTryvooIconPlace from '@/assets/image/home-icon-place.jpg';
import HomeWhyTryvooIconScalar from '@/assets/image/home-icon-scalar.jpg';

export const tryvoo_pros: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'pros.items.management.title',
    subtitleKey: 'pros.items.management.subtitle',
    image: HomeWhyTryvooIconAnalitics,
  },
  {
    id: 2,
    titleKey: 'pros.items.ai.title',
    subtitleKey: 'pros.items.ai.subtitle',
    image: HomeWhyTryvooIconReason,
  },
  {
    id: 3,
    titleKey: 'pros.items.offline.title',
    subtitleKey: 'pros.items.offline.subtitle',
    image: HomeWhyTryvooIconPlace,
  },
  {
    id: 4,
    titleKey: 'pros.items.scalability.title',
    subtitleKey: 'pros.items.scalability.subtitle',
    image: HomeWhyTryvooIconScalar,
  },
];
