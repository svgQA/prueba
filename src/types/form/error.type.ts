import { IElement, IFormat, IPage } from './form';

export interface IFormError extends IFormat {
  label_error?: string;
  description_error?: string;
  pages_error?: string;
}

export interface IElementError extends IElement {
  label_error?: string;
  elements?: IElementError[];
}

export interface IPageError extends IPage {
  pages_error?: string;
  elements: IElementError[];
}

export interface IFormatError extends IFormat {
  pages_error?: string;
  pages: IPageError[];
}
