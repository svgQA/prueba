import { IElementSelected } from '@/types/form';
import { computed, signal } from '@preact/signals';

const selectedElement = signal<IElementSelected | undefined | null>(null);

export const getSelectedElement = computed(() => selectedElement.value);
export const existSelectedElement = computed(
  () => selectedElement.value !== null
);
export const setSelectedElement = (selected?: IElementSelected) => {
  selectedElement.value = selected;
};

export const validateSelectedElement = (id: string) =>
  selectedElement.value?.id === id;

export const FORM_AUTO_SAVE_KEY = 'form_auto_save';
