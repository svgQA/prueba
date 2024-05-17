import { IMenu } from '@/components/common/interface';

export * from './card/card';

export interface IModalSidebarMenu {
  label: string;
  menus: IMenu[];
}
