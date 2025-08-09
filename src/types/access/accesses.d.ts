import { IUserRequest } from '@/types/auth';

export interface IAccess {
  id?: number;
  name: string;
  description: string;
  checkIn?: ICheckInAccesses;
  checkOut?: ICheckOutAccesses;
  userId?: number;
  user?: IUserAccess;
  createdAt?: string;
  updatedAt?: string;

  // Campos mostrados en el expansible
  // vehicleType: 'Carro' | 'Moto' | 'Bicicleta' | 'Patineta';
  // vehiclePlate: string;
  // observation: string;
}

export interface ICheckInAccesses {
  resource: [];
  startDate: string;
}

export interface ICheckOutAccesses {
  resource: [];
  endDate: string;
}

export interface IUserAccess extends IUserRequest {
  phone: string;
  houseNumber: string;
  address: string;
}
