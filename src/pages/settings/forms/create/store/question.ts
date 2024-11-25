import { ELEMENT_TYPE, IElement, IFormat, IPage } from '@/types/form';
import { computed, signal } from '@preact/signals';
import shortUUID from 'short-uuid';

const getNewElement = (section?: string, type?: ELEMENT_TYPE): IElement => ({
  id: shortUUID.generate(),
  label: '',
  type: type || ELEMENT_TYPE.INPUT,
  required: false,
  invisible: false,
  disable: false,
  assigned: false,
  section,
});

const getInitPage = (): IPage => ({
  id: shortUUID.generate(),
  label: '',
  elements: [getNewElement()],
});

export const format = signal<IFormat>({
  id: shortUUID.generate(),
  label: '',
  description: '',
  pages: [getInitPage()],
});

export const getFormLength = computed(() => format.value.pages.length);
export const getForm = computed(() => format.value);

export const addPage = () => {
  format.value = {
    ...format.value,
    pages: [...format.value.pages, getInitPage()],
  };
};

export const removePage = (pageId: string) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.filter((page) => page.id !== pageId),
  };
};

export const addElement = (page: string, section?: string) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((p: IPage) => {
      if (p.id === page) {
        if (section) {
          return {
            ...p,
            elements: p.elements.map((el: IElement) => {
              if (el.id === section) {
                return {
                  ...el,
                  elements: [...(el.elements || []), getNewElement(section)],
                };
              }
              return el;
            }),
          };
        }
        return {
          ...p,
          elements: [...p.elements, getNewElement()],
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
        const sectionId = shortUUID.generate();
        return {
          ...p,
          elements: [
            ...p.elements,
            {
              id: sectionId,
              label: '',
              type: ELEMENT_TYPE.SECTION,
              required: false,
              elements: [getNewElement(sectionId)],
            },
          ],
        };
      }
      return p;
    }),
  };
};

export function removeElement(id: string, page: string, section?: string) {
  let updatedPages = format.value.pages.map((p: IPage) => {
    if (p.id === page) {
      if (section) {
        return {
          ...p,
          elements: p.elements
            .map((el: IElement) => {
              if (el.id === section) {
                const filteredElements =
                  el.elements?.filter((e) => e.id !== id) || [];
                if (filteredElements.length === 0) {
                  // If section becomes empty, filter it out
                  return null;
                }
                return {
                  ...el,
                  elements: filteredElements,
                };
              }
              return el;
            })
            .filter((el): el is IElement => el !== null),
        };
      }
      const filteredElements = p.elements.filter(
        (element: IElement) => element.id !== id
      );
      return {
        ...p,
        elements: filteredElements,
      };
    }
    return p;
  });

  // Remove page if it has no elements
  updatedPages = updatedPages.filter((page) => page.elements.length > 0);

  format.value = {
    ...format.value,
    pages: updatedPages,
  };
}

export const moveElement = (
  dragIndex: number,
  hoverIndex: number,
  page: string,
  section?: string
) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((p: IPage) => {
      if (p.id === page) {
        if (section) {
          return {
            ...p,
            elements: p.elements.map((el: IElement) => {
              if (el.id === section && el.elements) {
                const updatedElements = [...el.elements];

                const dragElement = updatedElements[dragIndex];
                const hoverElement = updatedElements[hoverIndex];

                if (dragElement.section === hoverElement.section) {
                  const [movedElement] = updatedElements.splice(dragIndex, 1);
                  updatedElements.splice(hoverIndex, 0, movedElement);
                  return {
                    ...el,
                    elements: updatedElements,
                  };
                }
                return el;
              }
              return el;
            }),
          };
        }
        const updatedElements = [...p.elements];

        const dragElement = updatedElements[dragIndex];
        const hoverElement = updatedElements[hoverIndex];

        if (dragElement.section === hoverElement.section) {
          const [movedElement] = updatedElements.splice(dragIndex, 1);
          updatedElements.splice(hoverIndex, 0, movedElement);
          return {
            ...p,
            elements: updatedElements,
          };
        }
        return p;
      }
      return p;
    }),
  };
};
