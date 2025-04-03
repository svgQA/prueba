import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import MapLibrePointsMap from '../../../../components/common/map/MapLibrePointsMap';

type User = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

const LiveUserMap: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('Connecting...');
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io('http://localhost:3005');
    socketRef.current = socket;
    socket.on('connect', () => setConnectionStatus('Connected'));
    socket.on('disconnect', () => setConnectionStatus('Disconnected'));
    socket.on('connect_error', (error: any) => setConnectionStatus('Connection Error'));
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
    <div className="w-full h-full pt-12">
      <h2 className="text-2xl font-bold text-gray-800">🛰️ Usuarios en tiempo real</h2>
      <p className="text-sm text-gray-600 mb-2">
        Estado: <span className={connectionStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}>
          {connectionStatus}
        </span>
      </p>
      <p className="text-sm text-gray-600 mb-4">
        {users.length > 0
          ? `Mostrando ${users.length} usuarios en el mapa`
          : 'Esperando datos de ubicación...'}
      </p>

      <MapLibrePointsMap
        points={users}
        mapHeight="700px"
        markerColor="bg-blue-600"
        pointsLabel="ubicaciones"
        initialZoom={13}
        useUserLocation={true}
      />
    </div>
  );
};

export default LiveUserMap;