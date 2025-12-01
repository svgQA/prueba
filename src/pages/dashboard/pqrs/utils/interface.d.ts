import { IPresignedRequest, IPresignedResponse } from '@/types/file';

export interface ICPqrsRequest {
  id?: number;
  extraData: ICPqrs;
  filesBedrock?: IPresignedResponse[] | null;
  resource?: IPresignedRequest[] | null;
  status: string;
  inferences: any;
}

export interface ICPqrs {
  ticketNumber: string | null;
  filingDate: string | Date | null;
  accountNumber: string | null;
  procedure: string | null;
  registeredBy: string | null;
  requestStatus: string | null;
  expectedAttentionDate: string | Date | null;
  registerObservation: string | null;
  contractNumber: string | null;
  contractDetail: string | null;
  receptionChannel: string | null;
  assignee: string | null;
  orderNumber: string | null;
  orderStatus: string | null;
  attentionDate: string | Date | null;
  attentionExtensionDate: string | Date | null;
  legalizationDate: string | Date | null;
  numPages: number | null;
  contactEmail: string | null;
  clientOrCompanyName: string | null;
  actorType: string | null;
  referencedTicketNumber: string | null;
  requestType: string | null;
  associatedPlan: string | null;
  termStatus: string | null;
  daysToExpire: number | null;
  hasFiles: boolean;
  files: string[] | string | null;
  informationFile?: any | null;
}
