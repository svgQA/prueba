import MapLibrePointsMap from '@/components/common/map/MapLibrePointsMap';
import { tracking_service_url } from '@/env.config';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

type User = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const LiveUserMap: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Connecting...');
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(tracking_service_url);
    socketRef.current = socket;
    socket.on('connect', () => setConnectionStatus('Connected'));
    socket.on('disconnect', () => setConnectionStatus('Disconnected'));
    socket.on('connect_error', (_: any) =>
      setConnectionStatus('Connection Error')
    );
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

    socket.on('all-locations', (allUsers: User[]) => setUsers(allUsers));
    return () => socket.disconnect();
  }, []);

  // For debugging - log when users change
  useEffect(() => {
    console.log('Users updated:', users.length);
  }, [users]);

  return (
    <div className='px-4'>
      <div className='flex justify-end py-1'>
        <p className='text-sm text-gray-600'>
          Estado:{' '}
          <span
            className={
              connectionStatus === 'Connected'
                ? 'text-green-500'
                : 'text-red-500'
            }
          >
            {connectionStatus}
          </span>
          <h2 className='text-2xl font-bold text-gray-800'>
            🛰️ Usuarios en tiempo real
          </h2>
        </p>
      </div>

      <MapLibrePointsMap
        points={users}
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
