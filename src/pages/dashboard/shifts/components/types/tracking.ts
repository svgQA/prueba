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
};
