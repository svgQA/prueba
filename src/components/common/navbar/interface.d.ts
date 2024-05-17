import { VNode } from 'preact';
import { IComponentProps } from '../interface';

export interface INavbarProps extends IComponentProps {
  menus: IMenu[];
  logo?: VNode;
  actions?: VNode;
}
