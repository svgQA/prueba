import { IComponentProps } from '@/components/utils/interface';
import { type PropsWithChildren } from 'preact/compat';

export interface ICardProps extends IComponentProps, PropsWithChildren {
  color?: string;
  name?: string;
  shadow?: boolean;
  maxWidth?: string;
}
