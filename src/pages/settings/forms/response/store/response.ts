import { IResponse } from '@/types/form';
import { computed, signal } from '@preact/signals';

export enum RESPONSE_MODE_SERVICE {
  CREATE,
  UPDATE,
}

interface IResponseMode {
  mode: RESPONSE_MODE_SERVICE;
  id?: number;
}

const response = signal<IResponse>();
const responseMode = signal<IResponseMode>();

export const setResponse = (mode: IResponseMode, model: IResponse) => {
  response.value = model;
  responseMode.value = mode;
};

export const getResponse = computed(() => response.value);
export const getResponseMode = computed(() => responseMode.value);

export const updateResponse = (
  value: any,
  question: string,
  page: string,
  section?: string
) => {
  if (!response.value || !value) return;
  const output = {
    ...response.value,
    pages: response.value.pages.map((p) => {
      if (p.id === page) {
        if (section) {
          return {
            ...p,
            elements: p.elements.map((s) =>
              s.id === section
                ? {
                    ...s,
                    elements: s.elements?.map((element) =>
                      element.id === question
                        ? {
                            ...element,
                            value,
                          }
                        : element
                    ),
                  }
                : s
            ),
          };
        } else {
          return {
            ...p,
            elements: p?.elements.map((element) =>
              element.id === question
                ? {
                    ...element,
                    value,
                  }
                : element
            ),
          };
        }
      }
      return p;
    }),
  };
  console.log(output);
};
