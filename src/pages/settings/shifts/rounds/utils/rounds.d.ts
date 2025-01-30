export interface Round {
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
  markers?: any[];
}
