import { IComponentProps } from '@/components/utils/interface';
import { VNode } from 'preact';
import { type PropsWithChildren } from 'preact/compat';

export interface ILayerProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  description: string;
  image?: VNode;
}
