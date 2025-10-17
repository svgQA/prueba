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
