import { PropsWithChildren } from 'preact/compat';
import { IComponentProps } from '../interface';

export interface ISliderProps extends IComponentProps, PropsWithChildren {
  interval?: number;
}
