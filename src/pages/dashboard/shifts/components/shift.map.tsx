import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { tracking_service_url } from '@/env.config';
import React, { useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/store/slices';
import io from 'socket.io-client';
import { Search } from '@/components/common/search/search';
import { ColumnFilter } from '@tanstack/react-table';

type User = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  token: string;
  type: 'provider' | 'client';
  tenantId: number;
};

const LiveUserMap: React.FC<{ unsearch?: boolean }> = ({ unsearch }) => {
  const [users, setUsers] = useState<User[]>([]);
  const socketRef = useRef<any>(null);
  const { getToken, getSelected } = useUserStore();
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const socket = io(tracking_service_url, {
      query: { token: getToken(), tenantId: getSelected()?.tenant_id },
    });
    socketRef.current = socket;
    socket.on('connect', () => {});
    socket.on('disconnect', () => {});
    socket.on('connect_error', (_: any) => {});
    socket.on('location-update', (user: User) => {
      setUsers((prevUsers) => {
        const index = prevUsers.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          const updated = [...prevUsers];
          updated[index] = user;
          return updated;
        } else {
          return [...prevUsers, user];
        }
      });
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='px-4'>
      <div className='relative w-full my-2 flex items-center justify-end'>
        {!unsearch && (
          <Search
            id='search-map'
            name='search-map'
            onChange={(filters: ColumnFilter[]) => {
              const searchFilter = filters.find(
                (filter: ColumnFilter) => filter.id === 'name'
              );
              setSearchTerm(searchFilter ? String(searchFilter.value) : '');
            }}
          />
        )}
      </div>

      <MapLibrePointsMap
        points={filteredUsers}
        mapHeight='88vh'
        markerColor='bg-blue-600'
        pointsLabel='ubicaciones'
        initialZoom={3}
        useUserLocation={true}
      />
    </div>
  );
};

export default LiveUserMap;
