export type ShiftStatisticsData = {
  id: number;
  start: string | Date;
  end: string | Date;
  employeeId: number;
  status: string;
  hasCheckIn: boolean;
  hasCheckOut: boolean;
  roundPct: number;
  activityPct: number;
  companyId: number;
  tasksAmount: number;
  roundId?: number | null;
  hasRound: boolean;
  serviceId: number;
  pointsAmount?: number | null;
  frequency?: number | null;
  // NO VIENE DESDE BACKEND: Agregado en metrica
  roundPctTime?: number;
  active?: boolean;
};

export enum MetricStatus {
  SUCCESS = 'success',
  NEUTRAL = 'neutral',
  DANGER = 'danger',
}

export type MetricSeries = {
  values: number[];
  status: MetricStatus;
};

export type StatusThresholds = {
  success: number;
  neutral: number;
};

export type MetricsSeries = {
  user: MetricSeries;
  shift: MetricSeries;
  round: MetricSeries;
};
