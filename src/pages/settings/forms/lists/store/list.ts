import { computed, signal } from '@preact/signals';

interface IElementSelected {
  question: string;
  page?: string;
  section?: string;
  field: string;
}

const showListModal = signal<boolean>(false);
const elementSelected = signal<IElementSelected | undefined>();

export const getStatusListModal = computed(() => showListModal.value);
export const getStatusElementSelected = computed(() => elementSelected.value);

export const closeListModal = () => (showListModal.value = false);
export const openListModal = () => (showListModal.value = true);
export const toggleListModal = (selected?: IElementSelected) => {
  showListModal.value = !showListModal.value;
  if (showListModal.value) elementSelected.value = selected;
};
