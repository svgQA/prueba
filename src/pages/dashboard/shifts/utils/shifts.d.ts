// Definimos la estudtura de los datos de los Turnos

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  startTime: string;
  endTime: string;
  duration: string;
  notifications: number;
  activitiesProgress: number;
  moreInfo: string;
  checkIn: {
    date: string;
    status: string;
  };
  checkOut: {
    date: string;
    status: string;
  };
  city: string;
  address: string;
}
