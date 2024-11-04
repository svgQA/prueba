import { FORM_ITEM } from './form.enum';

export interface IFormElement {
  type: FORM_ITEM;
  label: string;
  description: string;
  icon: string;
  admin: boolean;
  id: string;
  selected?: boolean;
}

export interface IFormItem {
  label: string;
  icon: string;
  type: FORM_ITEM;
}
