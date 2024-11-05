import { computed, signal } from '@preact/signals';
import shortUUID from 'short-uuid';

export enum ELEMENT_TYPE {
  DROPDOWN,
  INPUT,
  NUMBER,
  DATE,
}

interface IBase {
  id: string;
  label: string;
  description?: string;
}

export interface IElement extends IBase {
  type: ELEMENT_TYPE;
  required: boolean;
}

interface IPage extends IBase {
  elements: IElement[];
}

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

export const form = signal<IPage[]>([getInitPage()]);

export const getFormLength = computed(() => form.value.length);

export const addPage = () => {
  form.value = [...form.value, getInitPage()];
};

export const addElement = (page: string) => {
  form.value = form.value.map((p) => {
    if (p.id === page) {
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
  });
};

export function removeElement(id: string, page: string) {
  form.value = form.value.map((p) => {
    if (p.id === page) {
      return {
        ...p,
        elements: p.elements.filter((element) => element.id !== id),
      };
    }
    return p;
  });
}

export const moveElement = (
  dragIndex: number,
  hoverIndex: number,
  pageId: string
) => {
  form.value = form.value.map((p) => {
    if (p.id === pageId) {
      const updatedElements = [...p.elements];
      const [movedElement] = updatedElements.splice(dragIndex, 1);
      updatedElements.splice(hoverIndex, 0, movedElement);
      return {
        ...p,
        elements: updatedElements,
      };
    }
    return p;
  });
};

// export const questions = signal<IElement[]>([]);

// export const moveQuestion = (dragIndex: number, hoverIndex: number) => {
//   const updatedQuestions = [...questions.value];
//   const [movedQuestion] = updatedQuestions.splice(dragIndex, 1);
//   updatedQuestions.splice(hoverIndex, 0, movedQuestion);
//   questions.value = updatedQuestions;
// };
