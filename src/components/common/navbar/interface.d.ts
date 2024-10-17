import { VNode } from 'preact';
import { type IMenu } from '../interface';
import { type IComponentProps } from '@/components/utils/interface';

export interface INavbarProps extends IComponentProps {
  menus: IMenu[];
  logo?: VNode;
  actions?: VNode;
  onActionHandler?: (action: string) => void;
  service?: VNode;
}
