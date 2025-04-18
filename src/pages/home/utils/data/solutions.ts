import { ISectionProps } from '../types';

import HomeSolution1 from '@/assets/image/home-solution-1.svg';
import HomeSolution2 from '@/assets/image/home-solution-2.svg';
import HomeSolution3 from '@/assets/image/home-solution-3.svg';
import HomeSolution4 from '@/assets/image/home-solution-4.svg';

export const tryvoo_solutions: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'solutions.items.security.title',
    subtitleKey: 'solutions.items.security.subtitle',
    image: HomeSolution1,
  },
  {
    id: 2,
    titleKey: 'solutions.items.logistics.title',
    subtitleKey: 'solutions.items.logistics.subtitle',
    image: HomeSolution2,
  },
  {
    id: 3,
    titleKey: 'solutions.items.construction.title',
    subtitleKey: 'solutions.items.construction.subtitle',
    image: HomeSolution3,
  },
  {
    id: 4,
    titleKey: 'solutions.items.health.title',
    subtitleKey: 'solutions.items.health.subtitle',
    image: HomeSolution4,
  },
];
