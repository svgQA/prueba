export interface ICAccesses {
  name: string;
  description: string;
  checkIn?: any;
  checkOut?: any;
  userId?: number;
}

export interface ICCorrespondence {
  sender: string;
  owner: string;
  receivedAt: string | Date;
  houseNumber: string;
  status: Correspondence_STATUS;
  whoPickedUp: string;
  packageType: string;
  observation: string;
  messageToOwner: string;
}

export enum Correspondence_STATUS {
  RECEIVED = 'RECEIVED',
  NOTIFIED = 'NOTIFIED',
  PICKED_UP = 'PICKED_UP',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}
