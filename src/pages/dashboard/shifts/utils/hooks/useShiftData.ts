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
// import { IShiftResponse } from '@/types/shift/activity';
import {
  withShiftNotifications,
  hasUsersWithPlayerIdFromShifts,
} from '../notification';
import { signalShifts } from '@/store/signals/shift';

type DateRangeFilters = { [key: string]: [string, string] } | null;

export function useShiftsData(params: {
  // shifts: Signal<IShiftResponse[]>;
  loading: Signal<boolean>;
  notificationValidate: Signal<boolean>;
}) {
  const { loading, notificationValidate } = params;

  const [services, setServices] = useState<MentionOption[]>([]);
  const [users, setUsers] = useState<MentionOption[]>([]);
  const [hasValidPlayer, setHasValidPlayer] = useState(false);

  const fetchInitialData = useCallback(
    async (rangeFilters?: DateRangeFilters) => {
      loading.value = true;

      const [
        shiftsResponse,
        servicesResponse,
        usersResponse,
        hasValidResponse,
      ] = await Promise.all([
        ShiftService.get_all(
          rangeFilters ? { ...baseParams, ...rangeFilters } : baseParams
        ),
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
