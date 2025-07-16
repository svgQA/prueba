import { IMenu } from '@/components/common/utils/interface';
import { NEW_BLACK_LIST } from '@/utils/menus';
import { computed, signal } from '@preact/signals';

export const historyLocation = signal<IMenu[]>([]);
export const currentPosition = signal<number>(0);
export const menuInformationSelected = signal<IMenu>({
  description: '',
  label: '',
  to: '',
  id: '',
});

export const computedCreateMenu = computed(() => ({
  link: `${menuInformationSelected.value.to}/create`,
  id: menuInformationSelected.value.id,
}));

export const computedValidateBlackList = computed(
  () =>
    !menuInformationSelected.value.id.includes('update') &&
    !NEW_BLACK_LIST.includes(menuInformationSelected.value.id)
);

export const computedValidateNewMenu = computed(
  () => !menuInformationSelected.value.id.includes('create')
);

export const setMenu = (menu: IMenu) => {
  menuInformationSelected.value = menu;
};

export const appendHistory = (menu: IMenu, action?: (menu: IMenu) => void) => {
  // Si el ultimo menu es el mismo, no se agrega
  const last = historyLocation.value.at(-1);
  const position = currentPosition.value;
  if (last?.to === menu.to) {
    currentPosition.value = position + 1;
    action?.(menu);
    return;
  }

  const cleanHistory = historyLocation.value.slice(0, position + 1);
  currentPosition.value = cleanHistory.length;
  historyLocation.value = [...cleanHistory, menu];
  action?.(menu);
};
