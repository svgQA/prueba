import { IOption } from '@/components/common/interface';
import { ELEMENT_TYPE } from './form.enum';
import { ITask } from '../shift';

interface IFormBase {
  id: string;
  label: string;
  description?: string;
}

interface ICondition {
  id: number;
  item: string;
  children: string[];
}

export interface IElement extends IFormBase {
  type: ELEMENT_TYPE; // SECTION

  required?: boolean;
  invisible?: boolean;
  disable?: boolean;

  assigned?: boolean;
  regex?: string; // INPUT
  size?: number; // Text Area, Image.
  maxNumberFiles?: number; // Cantiadad de imagenes
  default?: any;
  min?: number;
  max?: number;

  section?: string;
  parent?: string; // le asigno el valor de los hijos
  elements?: IElement[]; // Optional nested elements for sections
  tasks?: ITask[];
  url?: string;
  list?: number | string;

  // options?: number;
  options?: IOption[]; // para un dropdown, selector, checkbox, switch
  // conditions?: ICondition[];
}

export interface IPage extends IFormBase {
  elements: IElement[];
}

export interface IFormat extends IFormBase {
  pages: IPage[];
}

export interface IElementSelected {
  id: string;
  page: string;
  section?: string;
}
