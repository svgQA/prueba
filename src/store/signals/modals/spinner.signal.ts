import { computed, signal } from '@preact/signals';

const showSpinner = signal<boolean>(false);

export const getStatusSpinner = computed(() => showSpinner.value);

export const closeSpinner = () => (showSpinner.value = false);
export const openSpinner = () => (showSpinner.value = true);
export const toggleSpinner = () => (showSpinner.value = !showSpinner.value);
