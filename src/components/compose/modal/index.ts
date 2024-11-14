import { IMenu } from '@/components/common/interface';

export * from './card/menu';
export * from './card/user';
export * from './card/header';

export interface IModalSidebarMenu {
  label: string;
  base: string;
  menus: IMenu[];
}
