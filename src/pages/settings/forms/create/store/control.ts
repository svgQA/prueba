import { ISelected } from './interface';
import { computed, signal } from '@preact/signals';

const selectedElement = signal<ISelected | undefined | null>(null);

export const getSelectedElement = computed(() => selectedElement.value);
export const existSelectedElement = computed(
  () => selectedElement.value !== null
);
export const setSelectedElement = (selected?: ISelected) => {
  selectedElement.value = selected;
};

export const validateSelectedElement = (id: string) =>
  selectedElement.value?.id === id;
