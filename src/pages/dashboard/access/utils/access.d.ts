import { IUserRequest } from "@/types/auth";

export interface IAccess {
  id?: number;
  name: string;
  description: string;
  checkIn?: string;
  checkOut?: string;
  user?: IUserAccess;
  createdAt: string;
  updatedAt: string;
  createdBy: any | null;
  editedBy: any | null;
  deletedBy: any | null;

  // Campos mostrados en el expansible
  // vehicleType: 'Carro' | 'Moto' | 'Bicicleta' | 'Patineta';
  // vehiclePlate: string;
  // observation: string;
}

export interface IUserAccess extends IUserRequest {
  phone: string;
  houseNumber: string;
  address: string;
}
