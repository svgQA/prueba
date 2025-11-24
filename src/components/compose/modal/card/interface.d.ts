import { type IMenu } from '@/components/common/interface';
import { type IComponentProps } from '@/components/utils/interface';

export interface ICardSettingMenuProps {
  id: string;
  menus: IMenu[];
  label: string;
  base: string;
  // selected: IMenu;
  setting?: IMenu;
}

export interface ICardSettingUserProps extends IComponentProps {
  username: string;
  image: string;
  company: string;
  rol: string;
}

export interface ICardSettingHeaderProps extends IComponentProps {}
