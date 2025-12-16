/* WebSocket: actualiza shifts localmente para UPDATE y refetch en CREATE. */
import { useEffect } from 'preact/hooks';
// import { Signal } from '@preact/signals';
// import { IShiftResponse } from '@/types/shift/activity';
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';
import { rawDataManager } from '@/utils/statistics/data.manager';
import { metricsEngine } from '@/utils/statistics/metric.engine';
import { signalShifts } from '@/store/signals/shift';

type DateRangeFilters = { [key: string]: [string, string] } | null;

export function useShiftSocket(params: {
  // shifts: Signal<IShiftResponse[]>;
  dateRangeFilters: DateRangeFilters;
  onCreate: (range: DateRangeFilters) => void;
}) {
  const { dateRangeFilters, onCreate } = params;

  useEffect(() => {
    const handleMessage = (event: InSocketMessage<MessageEvent>) => {
      const { type: name, message } = event.payload;
      if (name === 'METRIC') {
        rawDataManager.updateOne(event.payload.id, {
          roundPct: event.payload.roundPct,
        });
        metricsEngine.recalculate();
        return;
      }

      if (
        name === SOCKET_MESSAGE_EVENTS.UPDATE ||
        name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK
      ) {
        const idx = signalShifts.value.findIndex(
          (s) => Number(s.id) === Number(message.id)
        );
        if (idx < 0) return;
        const copy = signalShifts.value.slice();
        copy[idx] = message as any;
        signalShifts.value = copy;
      }

      if (name === SOCKET_MESSAGE_EVENTS.CREATE) {
        onCreate(dateRangeFilters);
      }
    };

    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.SHIFTS,
      handleMessage,
      MESSAGE_LISTENERS.SHIFTS
    );

    return () => {
      WebSocketManager.remove(
        SOCKET_MESSAGE_AREA.SHIFTS,
        MESSAGE_LISTENERS.SHIFTS
      );
    };
  }, [dateRangeFilters, onCreate, signalShifts]);
}
