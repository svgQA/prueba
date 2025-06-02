import { IOption } from '@/components/common/smart-selector/smart-select';

export interface Memo {
  id: number;
  noveltyId?: number;
  serviceId?: number;
  companyId?: number;
  description: string;
  date?: string;
  latitude?: number;
  longitude?: number;
  state?: string;
  priority?: number | string;
  resource?: Resource;
  attachments: any[];
  updatedAt?: string | Date;
  createdAt?: string | Date;
  extraData?: ExtraData;
  novelty?: Novelty;
  service?: Service;
  updatedBy?: string;
  firstName: string;
  lastName: string;
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
  noveltyType: string;
  noveltyDate: string;
  location: string;
  moreInfo: string;
  city: string;
  company: string;
  address: string;
  mapUrl: string;
  supervisor: string;
  parentId: number;
  user: User;
  messages: number;
  userEdit: any;
  children: Memo[];
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
    id: number;
    name: string;
    description: string;
  };
  service: {
    name: string;
    description: string;
  };
  predefined?: IOption;
  category?: IOption;
  resolution?: IOption;
  duration?: string;
  time?: string;
}

export interface Resource {
  files: string | any[] | IFile[];
  images: string | any[] | IFile[];
}

export interface IFile {
  name: string;
  type: string;
  uuid: string;
  area: string;
  url?: string;
}

export interface IFilesMemo {
  images: IFile[];
  files: IFile[];
}
