import { IFormat, IFormRequest } from '@/types/form';

export const formValidation = (format: IFormRequest) => {
  if (!format.title || format.title.length < 5) {
    return 'form.error.title';
  }
  if (!format.title || format.title.length < 5) {
    return 'form.error.title';
  }
  if (!format.description || format.description.length < 5) {
    return 'form.error.description';
  }
  return structureValidation(format.structure);
};

const structureValidation = (structure: IFormat) => {
  if (!structure) {
    return 'form.structure.error.title';
  }
  for (const page of structure.pages) {
    if (!page.label || page.label.length < 5) {
      return 'form.page.error.title';
    }
    for (const element of page.elements) {
      if (!element.label || element.label.length < 5) {
        return 'form.element.error.title';
      }
      if (element.elements && element.elements.length > 0) {
        for (const subElement of element.elements) {
          if (!subElement.label || subElement.label.length < 5) {
            return 'form.element.error.title';
          }
        }
      }
    }
  }
  return null;
};
