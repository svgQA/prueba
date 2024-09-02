import { type PropsWithChildren } from 'preact/compat';
import { VNode } from 'preact';
import { type IComponentProps } from '@/components/utils/interface';

export interface IExpandProps extends IComponentProps, PropsWithChildren {
  header?: VNode;
  icon?: string;
}
