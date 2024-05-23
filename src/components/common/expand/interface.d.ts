import { type PropsWithChildren } from 'preact/compat';
import { type IComponentProps } from '../interface';
import { VNode } from 'preact';

export interface IExpandProps extends IComponentProps, PropsWithChildren {
  header?: VNode;
  icon?: string;
}
