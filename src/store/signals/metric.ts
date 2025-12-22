import { MetricsSeries, MetricStatus } from '@/utils/statistics/types';
import { computed, signal } from '@preact/signals';

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
    values: [50, 0, 0],
    status: MetricStatus.DANGER,
  },
};

const signalMetrics = signal<MetricsSeries>(initialData);

export const useMetricUser = computed(() => signalMetrics.value.user.values);
export const useMetricShift = computed(() => signalMetrics.value.shift.values);
export const useMetricRound = computed(() => signalMetrics.value.round.values);

export const setSignalMetric = (data: MetricsSeries) => {
  signalMetrics.value = data;
};
