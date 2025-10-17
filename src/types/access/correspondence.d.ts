export interface ICorrespondence {
  uuid: string;
  companyId: number;
  residenceUuid: string;
  sender: string;
  receivedAt: string;
  whoPickedUp: string;
  packageType: string;
  observation: string;
  messageToOwner: string;
  status: CorrespondenceStatus;
  receiverId: number | null;
  receiver: any | null;
  out: ICorrespondenceOut | null;

  // Relación con residence
  residence: {
    uuid: string;
    type: ResidenceType;
    houseNumber: string;
    block: string;
    floor: number;
    place: {
      id: number;
      name: string;
    };
    user: {
      id: number;
      name: string;
      surname: string;
      email: string;
      phone: string;
    };
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Audit fields
  createdBy?: {
    id: number;
    name: string;
  } | null;
  editedBy?: {
    id: number;
    name: string;
  } | null;
  deletedBy?: {
    id: number;
    name: string;
  } | null;
}

export interface ICorrespondenceOut {
  time: string;
  deliveredTo: string;
  signature: string | null;
}

export enum CorrespondenceStatus {
  RECEIVED = 'RECEIVED',
  DELIVERED = 'DELIVERED',
  IN_RECEPTION = 'IN_RECEPTION',
  NOTIFIED = 'NOTIFIED',
}

export enum ResidenceType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
}
