import { ELEMENT_TYPE, IElement, IFormat, IPage } from '@/types/form';
import { computed, signal } from '@preact/signals';
import shortUUID from 'short-uuid';
import { SWITCH_OPTIONS } from './constant';

export enum FORMAT_MODE_SERVICE {
  CREATE,
  UPDATE,
}

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

const buildInitFormat = (): IFormat => ({
  id: shortUUID.generate(),
  label: '',
  description: '',
  pages: [getInitPage()],
});

interface IFormMode {
  mode: FORMAT_MODE_SERVICE;
  id?: number;
}

const format = signal<IFormat>(buildInitFormat());
const formatMode = signal<IFormMode>({ mode: FORMAT_MODE_SERVICE.CREATE });
const hasUnsavedChanges = signal<boolean>(false);

export const setFormat = (
  mode: IFormMode = { mode: FORMAT_MODE_SERVICE.CREATE },
  model?: IFormat
) => {
  format.value =
    mode.mode === FORMAT_MODE_SERVICE.CREATE && !model
      ? buildInitFormat()
      : model || buildInitFormat();
  formatMode.value = mode;
};

export const setSingleFormat = (model: IFormat) => {
  format.value = { ...model };
};

export const getFormLength = computed(() => format.value.pages.length);
export const getForm = computed(() => format.value);
export const getFormMode = computed(() => formatMode.value);

export const setHasUnsavedChanges = (value: boolean) => {
  hasUnsavedChanges.value = value;
};

export const getHasUnsavedChanges = computed(() => hasUnsavedChanges.value);

export const addPage = () => {
  format.value = {
    ...format.value,
    pages: [...format.value.pages, getInitPage()],
  };
  hasUnsavedChanges.value = true;
};

export const removePage = (pageId: string) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.filter((page) => page.id !== pageId),
  };
  hasUnsavedChanges.value = true;
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
  hasUnsavedChanges.value = true;
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
  hasUnsavedChanges.value = true;
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
  hasUnsavedChanges.value = true;
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
  hasUnsavedChanges.value = true;
};

export const udpateGeneralForm = (name: string, value: string) => {
  format.value = {
    ...format.value,
    [name]: value,
  };
  hasUnsavedChanges.value = true;
};

export const updatePageForm = (
  name: string,
  value: string,
  page_id: string
) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((page) =>
      page.id === page_id ? { ...page, [name]: value } : page
    ),
  };
  hasUnsavedChanges.value = true;
};

export const updateForm =
  (question: string, page?: string, section?: string) =>
  (name: string, value: unknown, task?: string | number) => {
    format.value = {
      ...format.value,
      pages: format.value.pages.map((p) => {
        if (p.id === page) {
          if (section) {
            return {
              ...p,
              elements: p.elements.map((s: IElement) =>
                s.id === section
                  ? {
                      ...s,
                      elements: updateElement(
                        name,
                        question,
                        value,
                        task,
                        s.elements
                      ),
                    }
                  : s
              ),
            };
          } else {
            return {
              ...p,
              elements: updateElement(name, question, value, task, p.elements),
            };
          }
        }
        return p;
      }),
    };
    hasUnsavedChanges.value = true;
  };

const updateElement = (
  name: string,
  question: string,
  value: unknown,
  task?: string | number,
  elements?: IElement[]
): IElement[] => {
  if (!elements) return [];
  return elements?.map((element) =>
    element.id === question
      ? name === 'task'
        ? {
            ...element,
            tasks: element.tasks?.map((tsk) =>
              tsk.value == task
                ? {
                    ...tsk,
                    control: value as string | number,
                  }
                : tsk
            ),
          }
        : name === 'type'
          ? {
              ...element,
              type: value as ELEMENT_TYPE,
              options:
                (value as ELEMENT_TYPE) === ELEMENT_TYPE.SWITCH
                  ? SWITCH_OPTIONS
                  : [],
            }
          : {
              ...element,
              [name]: value,
            }
      : element
  );
};

export const updateSectionForm = (
  name: string,
  value: string,
  page_id: string,
  section_id: string
) => {
  format.value = {
    ...format.value,
    pages: format.value.pages.map((page) => {
      if (page.id !== page_id) return page;

      return {
        ...page,
        elements: page.elements.map((element) => {
          if (element.id === section_id) {
            return { ...element, [name]: value };
          }
          return element;
        }),
      };
    }),
  };
  hasUnsavedChanges.value = true;
};
