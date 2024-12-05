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

export const appendHistory = (menu: IMenu, action?: (menu: IMenu) => void) => {
  const position = currentPosition.value;
  const cleanHistory = historyLocation.value.slice(0, position + 1);
  currentPosition.value = cleanHistory.length;
  historyLocation.value = [...cleanHistory, menu];
  action?.(menu);
};
