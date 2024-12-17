import { IFormat } from '@/types/form';
import { computed, signal } from '@preact/signals';

export enum RESPONSE_MODE_SERVICE {
  CREATE,
  UPDATE,
}

interface IResponseMode {
  mode: RESPONSE_MODE_SERVICE;
  id?: number;
}

const response = signal<IFormat>();
const responseMode = signal<IResponseMode>();

export const setResponse = (mode: IResponseMode, model: IFormat) => {
  response.value = model;
  responseMode.value = mode;
};

export const getResponse = computed(() => response.value);
export const getResponseMode = computed(() => responseMode.value);

// export const addValue = (value: any, page: string, section?: string) => {};
