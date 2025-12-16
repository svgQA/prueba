import { IPresignedRequest } from '@/types/file';

interface IdName<T = number> {
  id: T;
  name: string;
  description?: string;
}

interface IPqrsArea extends IdName {
  area?: IdName;
  subarea: IdName;
}

export interface ICPqrsRequest {
  id?: number;
  raw?: any ;
  rawFile?: any ;
  resources?: IPresignedRequest[];
  embedding?: number[];
  extraData?: ICPqrsExtraData;
  status: string;
  identifier?: string;
  contract?: string;
  municipality?: string;
  address?: string;
  department?: string;
  transformer?: string;
  pole?: string;
  lat?: number;
  lng?: number;
  startDate?: string | Date;
  clientName?: string;
  contactEmail?: string;
  assignedToId?: number;
  areaId?: number;
  subareaId?: number;
  priorityId?: number;

  //relations
  inferences: Inference[];
  area?: IPqrsArea[];
  priority?: IdName;
  pqrs_ots?: ICOtsRequest[];
}

export interface Inference {
  title: string;
  subtitle: string;
  description: string;
  analysisRequest: string;
  analysisResponse: string;
  confidence: number;
  createdAt: string;
  stage: {
    id: number;
    stageName: string;
    goal: string;
    nextStageId: number | null;
    prevStageId: number | null;
    type: string;
  };
  ots?: ICOtsRequest | null;
  [key: string]: any;
}

export interface ICPqrsExtraData {
  title: string | null;
  observation: string | null;
  pqrsType: 'peticion' | 'queja' | 'reclamo' | 'sugerencia' | 'recurso';
  legalResourceType?:
    | 'reposicion'
    | 'apelacion'
    | 'reposicion_y_apelacion'
    | null;
  mainIssue: string | null;
  secondaryIssues?: string[] | null;
  affectedService: 'energia' | 'agua' | 'gas' | 'otro' | null;
  userRequest: string | null;
  referencedTicketNumber?: string | null;
  referencedInvoicePeriods?: string[] | null;
  receptionChannel?: 'web' | 'whatsapp' | 'oficina' | 'email' | 'otro' | null;
  sentiment?: 'negativo' | 'neutral' | 'positivo' | null;
}

export interface ICOtsRequest {
  id?: number;
  cost: number;
  status: OTS_STATUS;
  executionDate: string | Date;
  pqrs: ICPqrsRequest;
  inference?: Inference[];
}

export enum OTS_STATUS {
  OPENED = 'OPENED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}
