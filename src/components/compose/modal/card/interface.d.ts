import {
  type IComponentProps,
  type IMenu,
} from '@/components/common/interface';

export interface ICardSettingMenuProps extends IComponentProps {
  menus: IMenu[];
  label: string;
}
