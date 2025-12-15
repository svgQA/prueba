import { MetricsSeries, MetricStatus } from '@/utils/statistics/types';
import { signal } from '@preact/signals';

const initialData = {
  user: {
    values: [0, 0, 0],
    status: MetricStatus.DANGER,
  },
  shift: {
    values: [0, 0, 0],
    status: MetricStatus.DANGER,
  },
  round: {
    values: [0, 0, 0],
    status: MetricStatus.DANGER,
  },
};

export const signalMetrics = signal<MetricsSeries>(initialData);

export const setSignalMetric = (data: MetricsSeries) => {
  signalMetrics.value = data;
};
