// Definimos la estudtura de los datos de los Turnos

export interface Shift {
  id: number;
  employeeId: string;
  employeeName: string;
  workerPhoto: string;
  contact: number;
  workerEmail: string;
  startTime: string;
  endTime: string;
  duration: string;
  notifications: number;
  activitiesProgress: number;
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

// // Definimos la estudtura de los datos de los Turnos

// export interface Shift {
//   id: number;
//   employeeId: string;
//   employeeName: string;
//   workerPhoto: string;
//   contact: number;
//   workerEmail: string;
//   startTime: string;
//   endTime: string;
//   duration: string;
//   notifications: number;
//   activitiesProgress: number;
//   checkIn: {
//     date: string;
//     status: string;
//   };
//   checkOut: {
//     date: string;
//     status: string;
//   };
//   city: string;
//   address: string;
// }
