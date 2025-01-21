export interface IAccess {
  id: number;
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  houseNumber: string;

  // Campos mostrados en el expansible
  vehicleType: 'Carro' | 'Moto' | 'Bicicleta' | 'Patineta';
  vehiclePlate: string;
  observation: string;
}
