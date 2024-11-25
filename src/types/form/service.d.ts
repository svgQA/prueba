import { IFormat } from './form';

export interface IFormRequest {
  title: string;
  structure: IFormat;
  description: string;
  category?: string;
}

export interface IFormResponse extends IFormRequest {
  id: number;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
