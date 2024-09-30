import { IComponentProps } from '@/components/utils/interface';
import { type IMenu } from '../interface';

export interface ISidebarProps extends IComponentProps {
  menus: IMenu[];
  onSettingHandler?: () => void;
  onHomeHandler?: () => void;
  color?: string;
  size?: string;
  onLogout?: () => void;
  isNavigation?: boolean;
  onHandlerClick?: (menu: string) => void;
  position?: 'fixed' | 'relative' | 'relative' | 'static' | 'sticky';
}
