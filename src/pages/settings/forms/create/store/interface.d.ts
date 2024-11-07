export enum ELEMENT_TYPE {
  DROPDOWN,
  INPUT,
  NUMBER,
  DATE,
  SECTION,
}

interface IBase {
  id: string;
  label: string;
  description?: string;
}

export interface IElement extends IBase {
  type: ELEMENT_TYPE;
  required: boolean;
  elements?: IElement[]; // Optional nested elements for sections
}

export interface IPage extends IBase {
  elements: IElement[];
}

export interface IFormat extends IBase {
  pages: IPage[];
}
