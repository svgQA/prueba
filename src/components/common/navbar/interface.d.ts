import { VNode } from 'preact';
import { type IComponentProps, type IMenu } from '../interface';

export interface INavbarProps extends IComponentProps {
  menus: IMenu[];
  logo?: VNode;
  actions?: VNode;
}
