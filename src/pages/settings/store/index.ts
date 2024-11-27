import { IMenu } from '@/components/common/interface';
import { signal } from '@preact/signals';

export const historyLocation = signal<IMenu[]>([]);
export const currentPosition = signal<number>(0);
export const menuInformationSelected = signal<IMenu>({
  description: '',
  label: '',
  to: '',
  id: '',
});

export const setMenu = (menu: IMenu) => {
  menuInformationSelected.value = menu;
};
