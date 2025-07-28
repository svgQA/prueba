interface IUser {
  id: number;
  cognitoId: string;
  playerId: string;
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
    area?: string;
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
  points: any[];
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
  company: ICompany;
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
  report: IReport[];
  state: string;
  description: string;
  name: string;
  hasRound: boolean;
  extraData: {
    notes: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  promedio: number;
}
interface IReport {
  id: number;
  shiftId: number;
  description: string;
  responseId: string;
  requestDate: string | null;
  date: string;
  resource: Array<any>;
  updatedAt: string;
  createdAt: string;
  request: boolean;
}

interface IBreak {
  // TODO: Define break interface based on requirements
}

interface IReport {
  // TODO: Define report interface based on requirements
}

interface ICountry {
  id: number;
  name: string;
  iso2Code: string;
  iso3Code: string;
  phoneCode: string;
  officialLanguage: string[];
  currency: string;
  currencyCode: string;
  timeZone: string;
  flagUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  editedBy: string | null;
  deletedBy: string | null;
}

interface IMunicipality {
  id: number;
  code: string;
  name: string;
  latitude: string;
  longitude: string;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  editedBy: string | null;
  deletedBy: string | null;
}

export interface IShiftResponse {
  id: number;
  service: IService;
  tasks: ITaskHistory[]; // TODO: Define task interface based on requirements
  start: string;
  end: string;
  employeeId: number;
  schedule: any;
  employee: IUser;
  serviceId: number;
  status: string;
  type: string;
  assigned: boolean;
  break: IBreak[];
  report: IReport[];
  bane;
  task: TaskItemShift[];
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
  createdBy: string | null;
  editedBy: string | null;
  deletedBy: string | null;
  activityPct: number;
  roundPct: number;
  timeBefore: number;
  promedio: number;
  resource: any[];
}

interface ITaskHistory {
  id: number;
  date: string | null;
  state: boolean;
  solution: string | null;
  serviceTask: {
    id: number;
    name: string;
    description: string;
    formId: number | null;
    hourStart: string;
  };
}
export interface ITask {
  start: string;
  status: string;
  description: string;
  formId: number;
}

export interface TaskItemShift {
  id: number;
  name: string;
  description: string;
  hourStart: string;
  check: boolean;
}
