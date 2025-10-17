import { ISectionProps } from '../types';

import HomeSolution1 from '@/assets/image/home-solution-1.svg';
import HomeSolution2 from '@/assets/image/home-solution-2.svg';
import HomeSolution3 from '@/assets/image/home-solution-3.svg';
import HomeSolution4 from '@/assets/image/home-solution-4.svg';

export const tryvoo_solutions: ISectionProps[] = [
  {
    id: 1,
    titleKey: 'i_solutions_security_title',
    subtitleKey: 'i_solutions_security_subtitle',
    image: HomeSolution1,
  },
  {
    id: 2,
    titleKey: 'i_solutions_logistics_title',
    subtitleKey: 'i_solutions_logistics_subtitle',
    image: HomeSolution2,
  },
  {
    id: 3,
    titleKey: 'i_solutions_construction_title',
    subtitleKey: 'i_solutions_construction_subtitle',
    image: HomeSolution3,
  },
  {
    id: 4,
    titleKey: 'i_solutions_health_title',
    subtitleKey: 'i_solutions_health_subtitle',
    image: HomeSolution4,
  },
];
