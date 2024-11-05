import { computed, signal } from '@preact/signals';

const showIconsPage = signal<boolean>(false);

export const getStatusIconsPage = computed(() => showIconsPage.value);

export const closeIconsPage = () => (showIconsPage.value = false);
export const openIconsPage = () => (showIconsPage.value = true);
export const toggleIconsPage = () =>
  (showIconsPage.value = !showIconsPage.value);
