import { computed, signal } from '@preact/signals';

export const themeSignal = signal<boolean>(false);

export const getTheme = computed(() => themeSignal.value);

export const setTheme = (value: boolean) => (themeSignal.value = value);
export const toggleTheme = () => (themeSignal.value = !themeSignal.value);
