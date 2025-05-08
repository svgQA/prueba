export interface Memo {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  workerAge: number;
  workerPhoto: string;
  workerEmail: string;
  supervisorPhoto: string;
  supervisorPhone: number;
  supervisorEmail: string;
  supervisorAge: number;
  shift: string;
  clientName: string;
  clientPhone: number;
  clientEmail: string;
  clientLocation: string;
  clientPhoto: string;
  contact: number;
  visits: number;
  status: string;
  progress: number;
  priority: number | string;
  noveltyType: string;
  noveltyDate: string;
  location: string;
  moreInfo: string;
  city: string;
  company: string;
  address: string;
  mapUrl: string;
  extraData?: ExtraData;
  novelty?: Novelty;
  service?: Service;
  updatedAt?: string;
  createdAt?: string;
  resource?: Resource;
  attachments: any[];
  supervisor: string;
  updatedBy: string;
  state: string;
}

export interface Novelty {
  id: number;
  priority: number;
  description: string;
  createdBy: any | null;
  editedBy: any | null;
  companyId: number;
  deletedBy: any | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  autoResolve: boolean;
}

export interface Service {
  id: number;
  description: string;
  state: string;
  extraData: {
    notes: string;
  };
  createdBy: any | null;
  editedBy: any | null;
  companyId: number;
  deletedBy: any | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  contractId: number;
  placeId: number;
  roundId: number;
  task: {
    description: string;
  };
  hasRound: boolean;
}

export interface ExtraData {
  city: {
    name: string;
    country: string;
    department: string;
  };
  place: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  client: {
    name: string;
    phone: string;
  };
  company: {
    name: string;
    description: string;
  };
  service: {
    name: string;
    description: string;
  };
}

export interface Resource {
  files: string | string[];
  images: string | string[];
}
