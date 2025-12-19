import { computed, signal } from '@preact/signals';

export enum SHIFT_MODE {
  MONITOR,
  HISTORY,
}

export const signalShiftMode = signal<SHIFT_MODE>(SHIFT_MODE.MONITOR);

export const setSignalShiftMode = (data: SHIFT_MODE) => {
  signalShiftMode.value = data;
};

export const isMonitoring = computed(
  () => signalShiftMode.value === SHIFT_MODE.MONITOR
);
