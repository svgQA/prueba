import {
  type IComponentProps,
  type IMenu,
} from '@/components/common/interface';

export interface ICardSettingMenuProps extends IComponentProps {
  menus: IMenu[];
  label: string;
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
