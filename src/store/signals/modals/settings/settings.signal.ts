import { computed, signal } from '@preact/signals';

const showSettingsModal = signal<boolean>(false);
const redirectSettings = signal<string | undefined>(undefined);

export const getStatusSettingModal = computed(() => showSettingsModal.value);
export const getRedirectSettingModal = computed(() => redirectSettings.value);

export const closeSettingModal = (redirect?: string) => {
  showSettingsModal.value = false;
  redirectSettings.value = redirect;
};

export const openSettingModal = () => {
  showSettingsModal.value = true;
  redirectSettings.value = undefined;
};

export const toggleSettingModal = () =>
  (showSettingsModal.value = !showSettingsModal.value);
