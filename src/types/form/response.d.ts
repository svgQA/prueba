// export interface IResponse {
//   [key: string]: unknown;
// }

import { IElement, IFormat, IFormBase, IPage } from './form';

export interface IRValueObject {
  name: string;
  type:
    | 'jpg'
    | 'jpeg'
    | 'png'
    | 'mp3'
    | 'wav'
    | 'ogg'
    | 'aac'
    | 'pdf'
    | 'doc'
    | 'docx'
    | 'xls'
    | 'xlsx'
    | 'txt';
  url?: string;
  time?: number;
  date?: Date;
}

export interface IRElement extends IElement {
  value?: number | string | IRValueObject | boolean | any;
  elements?: IRElement[];
}

export interface IRPage extends IPage {
  elements: IRElement[];
}

export interface IResponse extends IFormat {
  pages: IRPage[];
}
