import { MetricStatus, StatusThresholds } from './types';

export function classifyStatus(
  percent: number,
  t: StatusThresholds
): MetricStatus {
  if (percent >= t.success) return MetricStatus.SUCCESS;
  if (percent >= t.neutral) return MetricStatus.NEUTRAL;
  return MetricStatus.DANGER;
}

export function toPercent(active: number, total: number, decimals = 0): number {
  if (total <= 0) return 0;
  const raw = (active / total) * 100;
  return toRound(raw, decimals);
}

export function toRound(value: number, decimals: number) {
  const f = Math.pow(10, decimals);
  return Math.round(value * f) / f;
}
