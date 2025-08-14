export interface ICorrespondence {
  id: number;
  companyId: number;
  sender: string;
  owner: string;
  receivedAt: string;
  houseNumber: string;
  status: CorrespondenceStatus;
  receiverId: number | null;
  whoPickedUp: string;
  packageType: string;
  observation: string;
  messageToOwner: string;
  out: ICorrespondenceOut | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  createdBy?: any;
  editedBy?: any;
  deletedBy?: any;
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
}
