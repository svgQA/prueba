import { IFormError, IPageError } from '@/types/form/error.type';
import i18n from '@/i18n';
import { IResponseError } from '@/types/form';

export const responseValidation = (
  format: IResponseError
): [IResponseError, boolean] => {
  let error = false;
  for (const page of format.pages) {
    for (const element of page.elements) {
      if (element.elements && element.elements.length > 0) {
        for (const subElement of element.elements) {
          if (subElement.required && subElement.assigned && !subElement.value) {
            subElement.value_error = i18n.t('form.create.error.required');
            error = true;
          } else {
            subElement.value_error = undefined;
          }
        }
      } else {
        if (element.required && element.assigned && !element.value) {
          element.value_error = i18n.t('form.create.error.required');
          error = true;
        } else {
          element.value_error = undefined;
        }
      }
    }
  }

  return [format, error];
};

export const formValidation = (format: IFormError): [IFormError, boolean] => {
  const message = i18n.t('form.create.error.title');
  let error = false;
  if (!format.label || format.label.length < 5) {
    format.label_error = message;
    error = true;
  } else {
    format.label_error = undefined;
  }
  if (!format.description || format.description.length < 5) {
    format.description_error = i18n.t('form.create.error.description');
    error = true;
  } else {
    format.description_error = undefined;
  }

  if (!format.pages || format.pages.length === 0) {
    format.pages_error = i18n.t('form.create.error.structure');
    error = true;
  } else {
    format.pages_error = undefined;
  }

  const [structure, errorStructure] = structureValidation(
    format.pages,
    message
  );
  format.pages = structure;
  error = error || errorStructure;

  return [format, error];
};

const structureValidation = (
  structure: IPageError[],
  message: string
): [IPageError[], boolean] => {
  let error = false;
  for (const page of structure) {
    if (!page.label || page.label.length < 5) {
      page.pages_error = message;
      error = true;
    } else {
      page.pages_error = undefined;
    }
    for (const element of page.elements) {
      if (!element.label || element.label.length < 5) {
        element.label_error = message;
        error = true;
      } else {
        element.label_error = undefined;
      }
      if (element.elements && element.elements.length > 0) {
        for (const subElement of element.elements) {
          if (!subElement.label || subElement.label.length < 5) {
            subElement.label_error = message;
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
