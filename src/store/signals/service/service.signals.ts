import { signal } from '@preact/signals';

const isInErrorState = signal<boolean>(false);
const typeOfError = signal<'network' | 'authorization' | 'unknown' | null>(
  null
);

export const getIsInErrorState = () => {
  return isInErrorState.value;
};

export const getTypeOfError = () => {
  return typeOfError.value;
};

export const setIsInErrorState = (value: boolean) => {
  isInErrorState.value = value;
};

export const setTypeOfError = (value: 'network' | 'authorization') => {
  typeOfError.value = value;
};

export const clearErrorState = () => {
  isInErrorState.value = false;
  typeOfError.value = null;
};
