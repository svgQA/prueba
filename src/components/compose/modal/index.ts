import { IMenu } from '@/components/common/utils/interface';

export * from './card/menu';
export * from './card/user';
export * from './card/header';

export interface IModalSidebarMenu {
  label: string;
  base: string;
  show?: boolean;
  new?: boolean;
  menus: IMenu[];
}
