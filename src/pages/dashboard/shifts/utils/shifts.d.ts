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
  city: string;
  address: string;
}
