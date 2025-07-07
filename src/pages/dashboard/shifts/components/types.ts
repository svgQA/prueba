export type Schedule = {
  days: DaySchedule[];
  daysAllowed: string[];
};

export type TimeBlock = {
  start: number;
  end: number;
};

export type DaySchedule = {
  day: string;
  dayIndex: number;
  blocks: TimeBlock[];
};

export type User = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  token: string;
  type: 'provider' | 'client';
  tenantId: number;
  userShifts?: any[];
};

export type Shift = {
  service?: {
    name?: string;
    contract?: {
      name?: string;
      client?: {
        name?: string;
      };
    };
    place?: {
      address?: string;
    };
  };
  status?: string;
};
