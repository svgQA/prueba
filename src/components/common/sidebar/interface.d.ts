import { IComponentProps } from '../interface';

export interface IMenu {
  label: string;
  description: string;
  icon?: string;
  to: string;
}

export interface ISidebarProps extends IComponentProps {
  menus: IMenu[];
  onSettingHandler?: () => void;
  onHomeHandler?: () => void;
  color?: string;
  size?: string;
  isNavigation?: boolean;
  onHandlerClick?: (menu: string) => void;
  position?: 'fixed' | 'relative' | 'relative' | 'static' | 'sticky';
}
