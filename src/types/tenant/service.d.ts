import { IFormat } from './form';

export interface ITenantRequest {
  title: string;
  structure: IFormat;
  description: string;
  category?: string;
}

export interface ITenantResponse extends ITenantRequest {
  id: number;
  responses?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
