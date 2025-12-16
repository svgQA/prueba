import { IShiftResponse } from '@/types/shift/activity';
import { rawDataManager } from '@/utils/statistics/data.manager';
import { metricsEngine } from '@/utils/statistics/metric.engine';
import { ShiftStatisticsData } from '@/utils/statistics/types';
import { signal } from '@preact/signals';

export const signalShifts = signal<IShiftResponse[]>([]);

export const setSignalMetricShifts = (model: ShiftStatisticsData[]) => {
  if (!model?.length) return;

  const shifts = signalShifts.value;

  // id -> index
  const indexById = new Map<string | number, number>();
  for (let i = 0; i < shifts.length; i++) indexById.set(shifts[i].id, i);

  let changed = false;

  for (const upd of model) {
    const idx = indexById.get(upd.id);
    if (idx === undefined) continue;

    shifts[idx] = {
      ...shifts[idx],
      active: upd.active,
      roundPctTime: upd.roundPctTime,
      risk: upd.risk,
    };
    changed = true;
  }

  if (changed) signalShifts.value = shifts.slice();
};

export const delSignalShifts = (_: number) => {};
export const setSignalShifts = (model: IShiftResponse) => {
  signalShifts.value = [
    ...signalShifts.value.map((ss) => {
      if (ss.id === model.id) return { ...ss, ...model };
      return ss;
    }),
  ];

  const _model: Partial<ShiftStatisticsData> = {
    start: model.start,
    end: model.end,
    status: model.status,
    hasCheckIn: !!model.checkIn,
    hasCheckOut: !!model.checkOut,
    roundPct: model.roundPct,
    activityPct: model.activityPct,
  };

  rawDataManager.updateOne(model.id, _model);
  metricsEngine.recalculate();
};
