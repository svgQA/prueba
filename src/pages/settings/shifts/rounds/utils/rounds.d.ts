export interface Round {
  id: number;
  employeeId: string;
  employeeName: string;
  workerPhoto: string;
  contact: number;
  workerEmail: string;
  startTime: string;
  description: string;
  name: string;
  endTime: string;
  frequency: number;
  radius: number;
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
