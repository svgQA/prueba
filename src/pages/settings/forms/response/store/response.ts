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
  section?: string,
  cvalue?: string
) => {
  if (!response.value) return;
  response.value = {
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
                        ? cvalue
                          ? {
                              ...element,
                              value: {
                                ...element.value,
                                [cvalue]: value,
                              },
                            }
                          : {
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
                ? cvalue
                  ? {
                      ...element,
                      value: {
                        ...element.value,
                        [cvalue]: value,
                      },
                    }
                  : {
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
};
