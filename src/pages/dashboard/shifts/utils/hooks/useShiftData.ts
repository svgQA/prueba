/* Fetch inicial + summary + servicios/usuarios. Centraliza el loading y normalización. */
import { useCallback, useState } from 'preact/hooks';
import { Signal } from '@preact/signals';
import {
  baseParams,
  NotificationService,
  ServiceService,
  ShiftService,
} from '@/services';
import { UserService } from '@/services/general/user';
import { MentionOption } from '@/components/common/mention-editor';
import {
  withShiftNotifications,
  hasUsersWithPlayerIdFromShifts,
} from '../notification';
import { signalShifts } from '@/store/signals/shift';
import { IRangeValues } from '@/components/common/table/components/range';
import { metricsEngine } from '@/utils/statistics/metric.engine';

type DateRangeFilters = IRangeValues | null;

export function useShiftsData(params: {
  loading: Signal<boolean>;
  notificationValidate: Signal<boolean>;
}) {
  const { loading, notificationValidate } = params;

  const [services, setServices] = useState<MentionOption[]>([]);
  const [users, setUsers] = useState<MentionOption[]>([]);
  const [hasValidPlayer, setHasValidPlayer] = useState(false);

  const fetchInitialData = useCallback(
    async (rangeFilter?: DateRangeFilters) => {
      loading.value = true;
      const _range_model = rangeFilter
        ? { [rangeFilter?.column]: rangeFilter.data }
        : baseParams;

      const [
        shiftsResponse,
        servicesResponse,
        usersResponse,
        hasValidResponse,
      ] = await Promise.all([
        ShiftService.get_all({ ...baseParams, ..._range_model }),
        ServiceService.getServicesSimpleList(),
        UserService.getListUsers(),
        NotificationService.hasUsersWithPlayerId(),
      ]);

      if (shiftsResponse && shiftsResponse.getStatus()) {
        const normalized = withShiftNotifications(shiftsResponse.getMany());
        notificationValidate.value = normalized.hasSomeNotifications;
        signalShifts.value = normalized.shifts;

        const fallbackHasValid = hasUsersWithPlayerIdFromShifts(
          normalized.shifts
        );
        setHasValidPlayer(fallbackHasValid);
      }

      if (servicesResponse.getStatus()) setServices(servicesResponse.getMany());
      if (usersResponse.getStatus()) setUsers(usersResponse.getMany());

      const { hasUsers } = hasValidResponse.getOne();
      setHasValidPlayer(hasUsers);

      loading.value = false;
      metricsEngine.recalculate();
    },
    [loading, notificationValidate]
  );

  return {
    services,
    users,
    hasValidPlayer,
    setHasValidPlayer,
    fetchInitialData,
  };
}
