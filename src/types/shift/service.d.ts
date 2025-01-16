import { IFormat } from './form';
import { ACTIVITY_STATUS, ACTIVITY_TYPE } from './shift.enum';

export interface IActivityRequest {
  start: Date;
  end: Date;
  status: ACTIVITY_STATUS;
  type: ACTIVITY_TYPE;
  assigned?: boolean;
  resourceId?: string;
  resource?: unknown;
  extraData?: unknown;
  keywords?: string[];
  externalId?: string;
}

export interface IActivityResponse extends IActivityRequest {
  id: number;
  checkIn?: unknown;
  checkOut?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IPlaceRequest {
  readonly name: string;
  readonly description: string;
  readonly longitude: number;
  readonly latitude: number;
}

export interface IRoundRequest {
  readonly name: string;
  readonly frequency: string;
  readonly markers: any;
  readonly place: string;
}

export interface IShiftRequest {
  readonly address: string;
  readonly city: string;
  readonly employee: string;
}
