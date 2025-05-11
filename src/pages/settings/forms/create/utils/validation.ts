// import { IFormat, IFormRequest } from '@/types/form';
import { IFormError, IPageError } from '@/types/form/error.type';
// import { t } from 'i18next';

export const formValidation = (format: IFormError): [IFormError, boolean] => {
  let error = false;
  if (!format.label || format.label.length < 5) {
    format.label_error = 'form.error.title';
    error = true;
  } else {
    format.label_error = undefined;
  }
  if (!format.description || format.description.length < 5) {
    format.description_error = 'form.error.description';
    error = true;
  } else {
    format.description_error = undefined;
  }

  if (!format.pages || format.pages.length === 0) {
    format.pages_error = 'form.error.structure';
    error = true;
  } else {
    format.pages_error = undefined;
  }

  const [structure, errorStructure] = structureValidation(format.pages);
  format.pages = structure;
  error = error || errorStructure;

  return [format, error];
};

const structureValidation = (
  structure: IPageError[]
): [IPageError[], boolean] => {
  let error = false;
  for (const page of structure) {
    if (!page.label || page.label.length < 5) {
      page.pages_error = 'form.page.error.title';
      error = true;
    } else {
      page.pages_error = undefined;
    }
    for (const element of page.elements) {
      if (!element.label || element.label.length < 5) {
        element.label_error = 'form.element.error.title';
        // structure.elements_error = 'form.element.error.title';
        error = true;
      } else {
        element.label_error = undefined;
      }
      if (element.elements && element.elements.length > 0) {
        for (const subElement of element.elements) {
          if (!subElement.label || subElement.label.length < 5) {
            subElement.label_error = 'form.element.error.title';
            // structure.subElements_error = 'form.element.error.title';
            error = true;
          } else {
            subElement.label_error = undefined;
          }
        }
      }
    }
  }
  return [structure, error];
};
