export interface Memo {
  id: number;
  relatedId: number;
  noveltyId: number;
  priority: number;
  resource: Resource;
  date: string;
  description: string;
  latitude: number;
  longitude: number;
  state: 'CREATED' | 'OPENED' | 'CLOSED' | string;
  type: 'SERVICE' | 'CONTRACT' | 'OTHER' | string;
  externalId: string;
  level: number;
  extraData: ExtraData;
  keywords: string[];
  userEdit: any | null;
  serviceId: number;
  createdBy: any | null;
  editedBy: any | null;
  companyId: number;
  deletedBy: any | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  novelty: Novelty;
  service: Service;
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
  files: string;
  images: string;
}
