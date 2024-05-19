import { PropsWithChildren } from 'preact/compat';
import { IComponentProps } from '../interface';

export interface ISidebarProps extends IComponentProps, PropsWithChildren {
  interval?: number;
}
