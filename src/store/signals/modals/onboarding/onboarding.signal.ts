import { computed, signal } from '@preact/signals';

const showOnBoardingModal = signal<boolean>(true);

export const getStatusOnBoardingModal = computed(
  () => showOnBoardingModal.value
);

export const closeOnBoardingModal = () => (showOnBoardingModal.value = true);
export const openOnBoardingModal = () => (showOnBoardingModal.value = false);
export const toggleOnBoardingModal = () =>
  (showOnBoardingModal.value = !showOnBoardingModal.value);
