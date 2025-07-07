import { IMenu } from '@/components/common/utils/interface';
import { localStorage } from '@/utils/storage';
import { computed, signal } from '@preact/signals';
export const SETTING_MODAL_STATE = 'modal_state';
export const SETTING_MODAL_MENU_SELECTED = 'modal_menu_selected';

const showSettingsModal = signal<boolean>(false);
const redirectSettings = signal<string | undefined>(undefined);

export const getStatusSettingModal = computed(() => showSettingsModal.value);
export const getRedirectSettingModal = computed(() => redirectSettings.value);

const setModalStatusStorage = (state: boolean) =>
  localStorage.set(SETTING_MODAL_STATE, state);

export const getModalStatusStorage = () =>
  localStorage.get(SETTING_MODAL_STATE);

export const setMenuSelecteStorage = (menu: IMenu) => {
  localStorage.set(SETTING_MODAL_MENU_SELECTED, menu);
};

export const getMenuSelectedStorage = () =>
  localStorage.get(SETTING_MODAL_MENU_SELECTED);

export const closeSettingModal = (redirect?: string) => {
  showSettingsModal.value = false;
  redirectSettings.value = redirect;
  setModalStatusStorage(false);
};

export const openSettingModal = () => {
  showSettingsModal.value = true;
  redirectSettings.value = undefined;
  setModalStatusStorage(true);
};

export const toggleSettingModal = () => {
  const status = !showSettingsModal.value;
  showSettingsModal.value = status;
  setModalStatusStorage(status);
};
