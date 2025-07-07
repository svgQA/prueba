import { IMenu } from '@/components/common/utils/interface';
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
  // Si el ultimo menu es el mismo, no se agrega
  const last = historyLocation.value.at(-1);
  const position = currentPosition.value;
  if (last?.to === menu.to) {
    currentPosition.value = position + 1;
    return;
  }

  const cleanHistory = historyLocation.value.slice(0, position + 1);
  currentPosition.value = cleanHistory.length;
  historyLocation.value = [...cleanHistory, menu];
  action?.(menu);
};
