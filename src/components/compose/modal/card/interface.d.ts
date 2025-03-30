import { type IMenu } from '@/components/common/interface';
import { type IComponentProps } from '@/components/utils/interface';

export interface ICardSettingMenuProps extends IComponentProps {
  menus: IMenu[];
  label: string;
  base: string;
  selected: IMenu;
  settings?: string;
}

export interface ICardSettingUserProps extends IComponentProps {
  username: string;
  image: string;
  company: string;
  rol: string;
}

export interface ICardSettingHeaderProps extends IComponentProps {
  title?: string;
  description?: string;
}
