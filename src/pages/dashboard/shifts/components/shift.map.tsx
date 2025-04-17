import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { tracking_service_url } from '@/env.config';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useUserStore } from '@/store/slices';
import io from 'socket.io-client';
import { Search } from '@/components/common/search/search';
import { ColumnFiltersState } from '@tanstack/react-table';
import { VNode } from 'preact';

type User = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  token: string;
  type: 'provider' | 'client';
  tenantId: number;
  userShifts?: any[];
};

type Shift = {
  service?: {
    name?: string;
    contract?: {
      name?: string;
      client?: {
        name?: string;
      };
    };
    place?: {
      address?: string;
    };
  };
  status?: string;
};

const LiveUserMap: React.FC<{ button?: VNode; unsearch?: boolean }> = ({
  unsearch,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [_, setConnectionStatus] = useState<string>('Connecting...');
  const socketRef = useRef<any>(null);
  const { getToken, getSelected } = useUserStore();
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

  useEffect(() => {
    const socket = io(tracking_service_url, {
      query: { token: getToken(), tenantId: getSelected()?.tenant_id },
    });
    socketRef.current = socket;
    socket.on('connect', () => setConnectionStatus('Connected'));
    socket.on('disconnect', () => setConnectionStatus('Disconnected'));

    socket.on('connect_error', (_: any) =>
      setConnectionStatus('Connection Error')
    );

    socket.on('location-update', (user: User | User[]) => {
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
    });

    socket.on('location-remove', (user: User | User[]) => {
      setUsers((prevUsers) => {
        if (Array.isArray(user)) {
          // Handle array of users to remove
          return prevUsers.filter(
            (existingUser) =>
              !user.some((userToRemove) => userToRemove.id === existingUser.id)
          );
        } else {
          // Handle single user to remove
          return prevUsers.filter(
            (existingUser) => existingUser.id !== user.id
          );
        }
        // return [...prevUsers, user];
      });
    });

    socket.on('user-disconnected', (user: { id: string }) => {
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
    });

    socket.on('all-locations', (allUsers: User[]) => {
      try {
        setUsers(allUsers);
      } catch (error) {
        console.error('Error: ', error);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const usersWithShifts = users.filter(
      (user) => user.userShifts && user.userShifts.length > 0
    );
    if (!searchFilters.length) return usersWithShifts;

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
      contract: (shift) => shift.service?.place?.address,
      client: (shift) => shift.service?.contract?.name,
    };

    return usersWithShifts.filter((user) => {
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
  }, [users, searchFilters]);

  return (
    <div className='px-4'>
      <div className='relative w-full my-2 flex items-center justify-end'>
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
        points={filteredUsers}
        mapHeight='79vh'
        initialZoom={3}
      />
    </div>
  );
};

export default LiveUserMap;
