import { IUserRequest } from '@/types/auth';

export interface IAccess {
  id: number;
  uuid: string;
  residenceUuid: string;
  placeId: number;
  placeName: string;
  residentName: string;
  residentSurname: string;
  houseNumber: string;
  block: string;
  floor: number;
  name: string;
  entryType: string;
  plate: string | null;
  observations: string | null;
  zoneId: number | null;
  zoneType: string | null;
  slotUuid: string | null;
  slotCode: string | null;
  slotIsOccupied: boolean | null;

  userId: number;
  user: IUserAccess;

  checkIn: ICheckInAccesses | null;
  checkOut: ICheckOutAccesses | null;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  createdBy: ICreatedBy | null;
  editedBy: IEditedBy | null;
  deletedBy: IDeletedBy | null;
}

export interface ICheckInAccesses {
  kind: string; // "PEATONAL" | "VEHICULAR" | etc.
  time: string; // ISO date string
  house: string;
  cardId: string;
  signature: string | null;
  personName: string;
}

export interface ICheckOutAccesses {
  kind: string;
  time: string;
}

export interface IUserAccess {
  name: string;
  extraData: {
    preferences: string;
  };
}

export interface ICreatedBy {
  id: number;
  name: string;
}

export interface IEditedBy {
  id: number;
  name: string;
}

export interface IDeletedBy {
  id: number;
  name: string;
}
