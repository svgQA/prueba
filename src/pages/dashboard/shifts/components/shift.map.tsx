import { Search } from '@/components/common/search/search';
import { ColumnFiltersState } from '@tanstack/react-table';
import { TrackingPayload, User } from './types';
import { useEffect, useMemo, useState } from 'preact/hooks';
import MapLibreShowPoints from '@/components/common/map/MapLibreShowPoints';
import { useTranslation } from 'react-i18next';
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
} from '@/utils/socket/manager/types';
import { ToastManager } from '@/utils/toast/toast-manager';

const LiveUserMap = ({ unsearch }: { unsearch?: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchFilters, setSearchFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation();

  const searchKeys = useMemo(
    () => [
      { id: 'user', label: t('h_user'), type: 'text' },
      { id: 'service', label: t('h_service'), type: 'text' },
      { id: 'contract', label: t('h_contract'), type: 'text' },
    ],
    []
  );

  const handleLocation = (message: InSocketMessage<TrackingPayload>) => {
    const {
      sub: id,
      coords: { latitude: lat, longitude: lng },
      name,
      shift,
    } = message.payload;

    setUsers((prev) => {
      const i = prev.findIndex((u) => u.id === id);

      if (i === -1) {
        return [
          ...prev,
          {
            id,
            lat,
            lng,
            name,
            type: 'provider',
            token: '',
            tenantId: 1,
            userShifts: shift ? [shift] : [],
          } as User,
        ];
      }

      const u = prev[i];
      if (
        u.lat === lat &&
        u.lng === lng &&
        u.name === name &&
        (u.userShifts?.length || 0) > 0
      )
        return prev;

      const next = prev.slice();
      next[i] = {
        ...u,
        lat,
        lng,
        name,
        userShifts: shift ? [shift] : u.userShifts || [],
      };
      return next;
    });
  };

  useEffect(() => {
    WebSocketManager.add(
      SOCKET_MESSAGE_AREA.TRACKING,
      handleLocation,
      'tracking-map'
    );
    return () => {
      WebSocketManager.remove(SOCKET_MESSAGE_AREA.TRACKING, 'tracking-map');
    };
  }, []);

  const matchesFilterValue = (
    value: string | undefined,
    filterValue: unknown
  ): boolean => {
    if (!value) return false;
    const values = Array.isArray(filterValue) ? filterValue : [filterValue];
    return values.some((v) =>
      value.toLowerCase().includes(String(v).toLowerCase())
    );
  };

  const getPointsByFilters = () => {
    let filteredUsers = users.filter(
      (user) => user.lat !== undefined && user.lng !== undefined
    );
    if (searchFilters.length === 0) return filteredUsers;

    let finalFilteredUsers = filteredUsers;
    const notFoundValues: string[] = [];
    const updatedFilters: ColumnFiltersState = [];

    searchFilters.forEach((filter) => {
      let values: unknown[] = Array.isArray(filter.value)
        ? filter.value
        : [filter.value];
      const validValues = values.filter(
        (v: any) => v && typeof v === 'string'
      ) as string[];
      if (validValues.length === 0) return;

      const foundValues: string[] = [];
      const filterLabel =
        filter.id === 'user'
          ? 'usuario'
          : filter.id === 'service'
            ? 'servicio'
            : 'contrato';

      validValues.forEach((searchValue: string) => {
        const usersMatchingThisValue = finalFilteredUsers.filter(
          (user: any) => {
            if (filter.id === 'user') {
              return user.name
                .toLowerCase()
                .includes(searchValue.toLowerCase());
            }

            if (filter.id === 'service' || filter.id === 'contract') {
              if (!user.userShifts || user.userShifts.length === 0)
                return false;
              const firstShift = user.userShifts[0];

              if (filter.id === 'service') {
                return matchesFilterValue(
                  firstShift.service?.name,
                  searchValue
                );
              }

              if (filter.id === 'contract') {
                return matchesFilterValue(
                  firstShift.service?.contract?.name,
                  searchValue
                );
              }
            }

            return true;
          }
        );

        if (usersMatchingThisValue.length > 0) {
          foundValues.push(searchValue);
        } else {
          notFoundValues.push(`${filterLabel}: ${searchValue}`);
        }
      });

      if (foundValues.length > 0) {
        finalFilteredUsers = finalFilteredUsers.filter((user: any) => {
          if (filter.id === 'user') {
            return foundValues.some((value: string) =>
              user.name.toLowerCase().includes(value.toLowerCase())
            );
          }

          if (filter.id === 'service' || filter.id === 'contract') {
            if (!user.userShifts || user.userShifts.length === 0) return false;
            const firstShift = user.userShifts[0];

            if (filter.id === 'service') {
              return foundValues.some((value: string) =>
                matchesFilterValue(firstShift.service?.name, value)
              );
            }

            if (filter.id === 'contract') {
              return foundValues.some((value: string) =>
                matchesFilterValue(firstShift.service?.contract?.name, value)
              );
            }
          }

          return true;
        });

        updatedFilters.push({
          ...filter,
          value: foundValues,
        });
      }
    });

    if (notFoundValues.length > 0) {
      ToastManager.error(
        `No se encontraron puntos para: ${notFoundValues.join(' | ')}`
      );
      setSearchFilters([...updatedFilters]);
    }

    if (finalFilteredUsers.length === 0) {
      return filteredUsers;
    }

    return finalFilteredUsers;
  };

  const mapPoints = useMemo(() => {
    const points = getPointsByFilters();
    return points?.map((user: User, index: number) => {
      const firstShift =
        user.userShifts && user.userShifts.length > 0
          ? user.userShifts[0]
          : null;

      return {
        id: index + 1,
        name: user.name,
        position: { lat: user.lat!, lng: user.lng! },
        shift: firstShift?.id || '',
        service: firstShift?.service?.name || '',
        contract: firstShift?.service?.contract?.name || '',
      };
    });
  }, [users, searchFilters]);

  return (
    <div>
      <div className='w-full py-1 pb-3 flex items-center justify-end h-14'>
        {unsearch && (
          <Search
            id='search-map'
            name='search-map'
            onChange={setSearchFilters}
            keys={searchKeys}
            value={searchFilters}
          />
        )}
      </div>

      <MapLibreShowPoints
        name='map-points'
        pointsRef={mapPoints}
        sendPoints={() => {}}
        height='78vh'
        disablePointSelection={true}
        adminUser={searchFilters.length === 0 ? true : false}
      />
    </div>
  );
};

export default LiveUserMap;
