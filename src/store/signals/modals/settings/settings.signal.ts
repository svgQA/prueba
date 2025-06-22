import { computed, signal } from '@preact/signals';

const showSettingsModal = signal<boolean>(true);

export const getStatusSettingModal = computed(() => showSettingsModal.value);

export const closeSettingModal = () => (showSettingsModal.value = false);
export const openSettingModal = () => (showSettingsModal.value = true);
export const toggleSettingModal = () =>
  (showSettingsModal.value = !showSettingsModal.value);
