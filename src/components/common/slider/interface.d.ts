import { type IComponentProps } from '@/components/utils/interface';
import { type PropsWithChildren } from 'preact/compat';

export interface ISliderProps extends IComponentProps, PropsWithChildren {
  interval?: number;
}
