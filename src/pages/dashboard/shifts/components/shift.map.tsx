import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { tracking_service_url } from '@/env.config';
import { useUserStore } from '@/store/slices';
import io from 'socket.io-client';
import { Search } from '@/components/common/search/search';
import { ColumnFiltersState } from '@tanstack/react-table';
import { Shift, User } from './types';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';

const LiveUserMap = ({ unsearch }: { unsearch?: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [_, setConnectionStatus] = useState<string>('Connecting...');
  const socketRef = useRef<any>(null);
  const { getToken, tenant } = useUserStore();
  const [searchFilters, setSearchFilters] = useState<ColumnFiltersState>([]);

  const searchKeys = useMemo(
    () => [
      { id: 'name', label: 'Nombre' },
      { id: 'service', label: 'Servicio' },
      { id: 'contract', label: 'Contrato' },
      { id: 'client', label: 'Cliente' },
    ],
    []
  );

  const connect_socket = () => {
    const socket = io(tracking_service_url, {
      query: { token: getToken(), tenantId: tenant, using: 'web' },
    });
    socketRef.current = socket;
    socket.on('connect', () => setConnectionStatus('Connected'));
    socket.on('disconnect', disconnect_socket);
    socket.on('connect_error', disconnect_socket);
    socket.on('location-update', handle_location_update);
    // socket.on('location-remove', handle_location_remove);
    // socket.on('user-disconnected', handle_user_disconnected);
    socket.on('all-locations', handle_all_locations);
  };

  const disconnect_socket = () => {
    if (socketRef.current) {
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setConnectionStatus('Disconnected');
  };

  /*
const handle_location_remove = (user: User | User[]) => {
  setUsers((prevUsers) => {
    if (Array.isArray(user)) {
      // Handle array of users
      return user.reduce(
        (acc, currentUser) => {
          const index = acc.findIndex((u) => u.id === currentUser.id);
          if (index !== -1) {
            acc[index] = currentUser;
          } else {
            acc.push(currentUser);
          }
          return acc;
        },
        [...prevUsers]
      );
    } else {
      // Handle single user
      const index = prevUsers.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        const updated = [...prevUsers];
        updated[index] = user;
        return updated;
      } else {
        return [...prevUsers, user];
      }
    }
  });
};

const handle_user_disconnected = (user: { id: string }) => {
  setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
}
*/

  const handle_location_update = (user: User | User[]) => {
    setUsers((prevUsers) => {
      if (Array.isArray(user)) {
        // Handle array of users
        return user.reduce(
          (acc, currentUser) => {
            const index = acc.findIndex((u) => u.id === currentUser.id);
            if (index !== -1) {
              acc[index] = currentUser;
            } else {
              acc.push(currentUser);
            }
            return acc;
          },
          [...prevUsers]
        );
      } else {
        // Handle single user
        const index = prevUsers.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          const updated = [...prevUsers];
          updated[index] = user;
          return updated;
        } else {
          return [...prevUsers, user];
        }
      }
    });
  };

  const handle_all_locations = (allUsers: User[]) => {
    setUsers(allUsers);
  };

  useEffect(() => {
    connect_socket();
    return () => disconnect_socket();
  }, []);

  const mapPoints = useMemo(() => {
    const usersWithShifts = users.filter(
      (user) =>
        user.userShifts && user.lat !== undefined && user.lng !== undefined
    );

    if (!searchFilters.length) {
      return usersWithShifts.map((user, index) => ({
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

    return points.map((user, index) => ({
      id: index + 1,
      position: { lat: user.lat!, lng: user.lng! },
    }));
  }, [users, searchFilters]);

  return (
    <div>
      <div className='w-full py-1 pb-3 flex items-center justify-end'>
        {!unsearch && (
          <Search
            id='search-map'
            name='search-map'
            onChange={setSearchFilters}
            keys={searchKeys}
            value={searchFilters}
            placeholder='Buscar por nombre, servicio, contrato...'
          />
        )}
      </div>

      <MapLibrePointsMap
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
