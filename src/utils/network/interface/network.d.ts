import { REQUEST_METHODS } from './network.enum';

export interface IParams {
  [key: string]: string | number;
}

export interface IHeaders extends IParams {}

export interface IModelRequest {
  data?: any;
  params?: IParams;
  headers?: IHeaders;
  method?: REQUEST_METHODS;
}

export interface IGenericData {
  code: number;
  message: string;
  data: any;
}

export interface IMakeRequest extends IModelRequest {
  url: string[];
  uncontent?: boolean;
}
