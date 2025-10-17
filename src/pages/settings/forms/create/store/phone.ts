import { computed, signal } from '@preact/signals';

export const phonePage = signal<number>(0);

export const getPhonePage = computed(() => phonePage.value);

export const setPhonePage = (value: number) => {
  phonePage.value = value;
};

export const incrementPhonePage = () => {
  phonePage.value++;
};

export const decrementPhonePage = () => {
  if (phonePage.value > 0) {
    phonePage.value--;
  }
};
