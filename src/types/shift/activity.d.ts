interface IUser {
  id: number;
  cognitoId: string;
  externalId: string;
  externalPlatformId: string;
  name: string;
  surname: string;
  image: string;
  phone: string;
  email: string;
  cardId: string;
  cardType: number;
  extraData: {
    preferences: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  lastConnection: string;
  address: string;
  replicate: boolean;
  userType: string;
}

interface IRound {
  id: number;
  name: string;
  frequency: number;
  percentage: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface IPlace {
  id: number;
  code: number;
  radius: number;
  name: string;
  description: string;
  municipalityId: number;
  address: string;
  latitude: number;
  longitude: number;
  state: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  municipality: {
    code: string;
    name: string;
  };
  country: {
    name: string;
  };
}

interface IContract {
  user: IUser;
  id: number;
  name: string;
  description: string;
  clientId: number;
  client: IUser;
  startDate: string;
  endDate: string;
  state: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface IService {
  round: IRound;
  place: IPlace;
  contract: IContract;
  id: number;
  contractId: number;
  placeId: number;
  roundId: number;
  task: {
    description: string;
  };
  state: string;
  description: string;
  hasRound: boolean;
  extraData: {
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface IShiftResponse {
  id: number;
  user: IUser;
  service: IService;
  start: string;
  end: string;
  employeedId: number;
  employee: IUser;
  serviceId: number;
  status: string;
  type: string;
  assigned: boolean;
  checkIn: {
    time: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  checkOut: {
    time: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  extraData: {
    notes: string;
  };
  keywords: string[];
  externalId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
