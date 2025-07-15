import { useLocation } from 'wouter';
import {
  appendHistory,
  setMenu,
  currentPosition,
  historyLocation,
  menuInformationSelected,
  computedCreateMenu,
} from '@/utils/hooks/store/settings';
import {
  getStatusSettingModal,
  openSettingModal,
  setMenuSelecteStorage,
} from '@/store/signals/modals';
import type { IMenu } from '@/components/common/utils/interface';

export function useNavigation() {
  const [_, navigate] = useLocation();

  const go = (menu: IMenu, openModal: boolean = false) => {
    if (!menu.to) return;

    if (!getStatusSettingModal.value && openModal) {
      openSettingModal();
    }

    setMenu(menu);
    setMenuSelecteStorage(menu);
    appendHistory(
      { ...menu, to: menu.base ? `/${menu.base}${menu.to}` : menu.to },
      setMenu
    );
    navigate(menu.to);
  };

  const goBack = () => {
    if (currentPosition.value > 0) {
      --currentPosition.value;
      const prev = historyLocation.value[currentPosition.value];
      setMenu(prev);
      setMenuSelecteStorage(prev);
      navigate(prev.to);
    }
  };

  const goForward = () => {
    if (currentPosition.value < historyLocation.value.length - 1) {
      ++currentPosition.value;
      const next = historyLocation.value[currentPosition.value];
      setMenu(next);
      setMenuSelecteStorage(next);
      navigate(next.to);
    }
  };

  const reset = () => {
    currentPosition.value = 0;
    const first = historyLocation.value[0];
    if (first) {
      setMenu(first);
      setMenuSelecteStorage(first);
      navigate(first.to);
    }
  };

  return {
    go,
    goBack,
    goForward,
    reset,
    current: menuInformationSelected.value,
    history: historyLocation.value,
    position: currentPosition.value,
    created: computedCreateMenu.value,
    settings: getStatusSettingModal.value,
  };
}
