export type User = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  token: string;
  type: 'provider' | 'client';
  tenantId: number;
  userShifts?: any[];
};

export type TrackingPayload = {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  name: string;
  sub: string;
  shift?: {
    id: string;
    start: string;
    end: string;
    status: string;
    service?: {
      id: number;
      name: string;
      place?: {
        id: number;
        name: string;
        address: string;
      };
      round?: {
        id: number;
        name: string;
        radius: number;
      };
      contract?: {
        id: number;
        name: string;
      };
    };
  };
};
