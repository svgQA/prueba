import { Search } from '@/components/common/search/search';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Shift, TrackingPayload, User } from './types';
import { useEffect, useMemo, useState } from 'preact/hooks';
import MapLibreShowPoints from '@/components/common/map/MapLibreShowPoints';
import { useTranslation } from 'react-i18next';
import { WebSocketManager } from '@/utils/socket/manager/manager';
import {
  InSocketMessage,
  SOCKET_MESSAGE_AREA,
} from '@/utils/socket/manager/types';

const LiveUserMap = ({ unsearch }: { unsearch?: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchFilters, setSearchFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation();

  const searchKeys = useMemo(
    () => [
      { id: 'name', label: t('h_name'), type: 'text' },
      { id: 'service', label: t('h_service'), type: 'text' },
      { id: 'contract', label: t('h_contract'), type: 'text' },
      { id: 'client', label: t('h_client'), type: 'text' },
    ],
    []
  );

  const handleLocation = (message: InSocketMessage<TrackingPayload>) => {
    const {
      sub: id,
      coords: { latitude: lat, longitude: lng },
      name,
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
            userShifts: [],
          } as User,
        ];
      }

      const u = prev[i];
      if (u.lat === lat && u.lng === lng && u.name === name) return prev;

      const next = prev.slice();
      next[i] = { ...u, lat, lng, name };
      return next;
    });
  };

  useEffect(() => {
    WebSocketManager.add(SOCKET_MESSAGE_AREA.TRACKING, handleLocation);
    return () => {
      WebSocketManager.remove(SOCKET_MESSAGE_AREA.TRACKING);
    };
  }, []);

  const mapPoints = useMemo(() => {
    const usersWithShifts = users.filter(
      (user) =>
        user.userShifts && user.lat !== undefined && user.lng !== undefined
    );

    if (!searchFilters.length) {
      return usersWithShifts?.map((user, index) => ({
        id: index + 1,
        position: { lat: user.lat!, lng: user.lng! },
      }));
    }

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

    const propertyGetters: Record<
      string,
      (shift: Shift) => string | undefined
    > = {
      service: (shift) => shift.service?.name,
      contract: (shift) => shift.service?.contract?.name,
      client: (shift) => shift.service?.contract?.client?.name,
    };

    const points = usersWithShifts.filter((user) => {
      const nameFilter = searchFilters.find((filter) => filter.id === 'name');
      if (nameFilter?.value) {
        if (!matchesFilterValue(user.name, nameFilter.value)) {
          return false;
        }
      }

      const shiftRelatedFilters = searchFilters.filter((filter) =>
        ['service', 'contract', 'client'].includes(filter.id)
      );
      if (shiftRelatedFilters.length === 0) return true;
      const firstShift = user.userShifts![0];

      return shiftRelatedFilters.every((filter) => {
        if (filter.id === 'name') return true;
        const getter = propertyGetters[filter.id];
        if (!getter) return true;
        return matchesFilterValue(getter(firstShift), filter.value);
      });
    });

    return points?.map((user, index) => ({
      id: index + 1,
      position: { lat: user.lat!, lng: user.lng! },
    }));
  }, [users, searchFilters]);

  return (
    <div>
      <div className='w-full py-1 pb-3 flex items-center justify-end h-14'>
        {!unsearch && (
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
        adminUser={true}
      />
    </div>
  );
};

export default LiveUserMap;
