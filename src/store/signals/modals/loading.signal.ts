import { computed, signal } from '@preact/signals';

const showLoading = signal<boolean>(false);

export const getStatusLoading = computed(() => showLoading.value);

export const closeLoading = () => (showLoading.value = false);
export const openLoading = () => (showLoading.value = true);
export const toggleLoading = () => (showLoading.value = !showLoading.value);
