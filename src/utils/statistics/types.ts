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
  serviceName?: string | null;
  contractId?: number | null;
  contractName?: string | null;
  lastConnection?: string | null;
  // NO VIENE DESDE BACKEND: Agregado en metrica
  roundPctTime?: number;
  active?: boolean;
  risk?: number;
  state?: SHITF_LIVE_STATE;
};

export enum SHITF_LIVE_STATE {
  TO_START,
  PROGRESS,
  FINISHED,
}

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
