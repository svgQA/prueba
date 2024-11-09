export enum ELEMENT_TYPE {
  TITLE,
  PARAGRAPH,
  INPUT,
  TEXT_AREA,
  NUMBER_INPUT,
  DROPDOWN,
  RADIO_BUTTON,
  CHECK_BOX,
  SWITCH,
  DATE,
  RATING,
  IMAGE,
  SIGNATURE,
  QR,
  AUDIO,
  CALCULATE,
  SECTION,
}

interface IBase {
  id: string;
  label: string;
  description?: string;
}

interface IOption {
  value: string;
  label: string;
}

interface ICondition {
  id: number;
  item: string;
  children: string[];
}

export interface IElement extends IBase {
  type: ELEMENT_TYPE; // SECTION

  // ATTRS
  required?: boolean;
  visible?: boolean;
  disable?: boolean;

  assigned?: boolean;
  // regex?: string; // INPUT
  // size?: number; // Text Area, Image.
  // maxNumberFiles?: number; // Cantiadad de imagenes
  // default?: any;

  // options?: IOption[]; // para un dropdown, selector, checkbox, switch

  // conditions?: ICondition[];
  // parent?: string; // le asigno el valor de los hijos
  // ATTRS

  elements?: IElement[]; // Optional nested elements for sections
}

export interface IPage extends IBase {
  elements: IElement[];
}

export interface IFormat extends IBase {
  pages: IPage[];
}

export interface ISelected {
  id: string;
  page: string;
  section?: string;
}
