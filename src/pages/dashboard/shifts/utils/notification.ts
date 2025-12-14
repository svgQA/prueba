/* Normaliza shifts agregando hasNotifications y retorna flag global. */
import { IShiftResponse } from '@/types/shift/activity';

export function withShiftNotifications(list: IShiftResponse[]): {
  hasSomeNotifications: boolean;
  shifts: IShiftResponse[];
} {
  let hasSomeNotifications = false;

  const shifts = list.map((s) => {
    const has = !!(s.employee?.playerId && String(s.employee.playerId).trim());
    if (has) hasSomeNotifications = true;
    return { ...s, hasNotifications: has };
  });

  return { hasSomeNotifications, shifts };
}

export function hasUsersWithPlayerIdFromShifts(
  list: IShiftResponse[]
): boolean {
  return list.some(
    (s) =>
      typeof s?.employee?.playerId === 'string' &&
      s.employee.playerId.trim() !== ''
  );
}
