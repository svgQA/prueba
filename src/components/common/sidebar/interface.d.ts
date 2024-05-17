import { type IComponentProps, type IMenu } from '../interface';

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
