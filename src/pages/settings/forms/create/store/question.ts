import { computed, signal } from '@preact/signals';
import shortUUID from 'short-uuid';
import { ELEMENT_TYPE, IElement, IFormat, IPage } from './interface.d';

const getInitPage = (): IPage => ({
  id: shortUUID.generate(),
  label: 'New Page',
  elements: [
    {
      id: shortUUID.generate(),
      label: 'New Element',
      type: ELEMENT_TYPE.INPUT,
      required: false,
    },
  ],
});

export const format = signal<IFormat>({
  id: shortUUID.generate(),
  label: '',
  description: '',
  pages: [getInitPage()],
});

export const getFormLength = computed(() => format.value.pages.length);

export const addPage = () => {
  format.value = {
    ...format.value,
    pages: [...format.value.pages, getInitPage()],
  };
};

export const addElement = (page: string, parentElementId?: string) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((p: IPage) => {
      if (p.id === page) {
        if (parentElementId) {
          return {
            ...p,
            elements: p.elements.map((el: IElement) => {
              if (el.id === parentElementId) {
                return {
                  ...el,
                  elements: [
                    ...(el.elements || []),
                    {
                      id: shortUUID.generate(),
                      label: 'New Element',
                      type: ELEMENT_TYPE.INPUT,
                      required: false,
                    },
                  ],
                };
              }
              return el;
            }),
          };
        }
        return {
          ...p,
          elements: [
            ...p.elements,
            {
              id: shortUUID.generate(),
              label: 'New Element',
              type: ELEMENT_TYPE.INPUT,
              required: false,
            },
          ],
        };
      }
      return p;
    }),
  };
};

export const addSection = (page: string) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((p: IPage) => {
      if (p.id === page) {
        return {
          ...p,
          elements: [
            ...p.elements,
            {
              id: shortUUID.generate(),
              label: 'New Section',
              type: ELEMENT_TYPE.SECTION,
              required: false,
              elements: [],
            },
          ],
        };
      }
      return p;
    }),
  };
};

export function removeElement(
  id: string,
  page: string,
  parentElementId?: string
) {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((p: IPage) => {
      if (p.id === page) {
        if (parentElementId) {
          return {
            ...p,
            elements: p.elements.map((el: IElement) => {
              if (el.id === parentElementId) {
                return {
                  ...el,
                  elements: el.elements?.filter((e) => e.id !== id),
                };
              }
              return el;
            }),
          };
        }
        return {
          ...p,
          elements: p.elements.filter((element: IElement) => element.id !== id),
        };
      }
      return p;
    }),
  };
}

export const moveElement = (
  dragIndex: number,
  hoverIndex: number,
  pageId: string,
  parentElementId?: string
) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((p: IPage) => {
      if (p.id === pageId) {
        if (parentElementId) {
          return {
            ...p,
            elements: p.elements.map((el: IElement) => {
              if (el.id === parentElementId && el.elements) {
                const updatedElements = [...el.elements];
                const [movedElement] = updatedElements.splice(dragIndex, 1);
                updatedElements.splice(hoverIndex, 0, movedElement);
                return {
                  ...el,
                  elements: updatedElements,
                };
              }
              return el;
            }),
          };
        }
        const updatedElements = [...p.elements];
        const [movedElement] = updatedElements.splice(dragIndex, 1);
        updatedElements.splice(hoverIndex, 0, movedElement);
        return {
          ...p,
          elements: updatedElements,
        };
      }
      return p;
    }),
  };
};
