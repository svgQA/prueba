/* WEBSOCKET: actualiza shifts localmente para UPDATE y refetch en CREATE. */
import { useEffect } from 'preact/hooks';
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
  SOCKET_MESSAGE_EVENTS,
  MessageEvent,
  MESSAGE_LISTENERS,
} from '@/utils/socket/manager/types';
import { setSignalShifts, signalShifts } from '@/store/signals/shift';
import { IShiftResponse } from '@/types/shift/activity';

type DateRangeFilters = { [key: string]: [string, string] } | null;

export function useShiftSocket(params: {
  dateRangeFilters: DateRangeFilters;
  onCreate: (range: DateRangeFilters) => void;
}) {
  const { dateRangeFilters, onCreate } = params;

  useEffect(() => {
    const handleMessage = (event: InSocketMessage<MessageEvent>) => {
      const { type: name, message } = event.payload;

      if (
        name === SOCKET_MESSAGE_EVENTS.UPDATE ||
        name === SOCKET_MESSAGE_EVENTS.UPDATE_CHECK
      ) {
        const _model = message as IShiftResponse;
        if (!_model || !_model.id) return;

        setSignalShifts(_model);
        {
          /**
           * OLD: Actualizar datos viejos desde
           */
          // const idx = shifts.value.findIndex(
          //   (s) => Number(s.id) === Number(_model.id)
          // );
          // if (idx < 0) return;
          // const copy = shifts.value.slice();
          //
          // copy[idx] = message;
          // shifts.value = copy;
          //
          // const model: Partial<ShiftStatisticsData> = {
          //   start: _model.start,
          //   end: _model.end,
          //   status: _model.status,
          //   hasCheckIn: !!_model.checkIn,
          //   hasCheckOut: !!_model.checkOut,
          //   roundPct: _model.roundPct,
          //   activityPct: _model.activityPct,
          // };
          // rawDataManager.updateOne(_model.id, model);
          // metricsEngine.recalculate();
        }
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
