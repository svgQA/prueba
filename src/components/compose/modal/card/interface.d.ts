import { type IMenu } from '@/components/common/interface';
import { type IComponentProps } from '@/components/utils/interface';
import { IPresignedRequest } from '@/types/file';

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
  image?: IPresignedRequest;
  company: string;
  rol: string;
}

export interface ICardSettingHeaderProps extends IComponentProps {}
