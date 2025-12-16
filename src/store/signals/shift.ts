import { IShiftResponse } from '@/types/shift/activity';
import { ShiftStatisticsData } from '@/utils/statistics/types';
import { signal } from '@preact/signals';

export const signalShifts = signal<IShiftResponse[]>([]);

export const setSignalMetricShifts = (data: ShiftStatisticsData[]) => {
  // signalMetrics.value = data;
};

export const setSignalSocketShifts = (data: IShiftResponse) => {
  // signalMetrics.value = data;
};
