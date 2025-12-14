import { IPresignedRequest } from '@/types/file';

interface IdName<T = number> {
  id: T;
  name: string;
  description?: string;
}

export interface ICPqrsRequest {
  id?: number;
  raw?: any | null;
  rawFile?: any | null;
  resources?: IPresignedRequest[] | null;
  embedding?: number[] | null;
  extraData?: ICPqrsExtraData | null;
  status: string;
  identifier?: string | null;
  contract?: string | null;
  municipality?: string | null;
  address?: string | null;
  department?: string | null;
  transformer?: string | null;
  pole?: string | null;
  lat?: number | null;
  lng?: number | null;
  startDate?: string | Date | null;
  clientName?: string | null;
  contactEmail?: string | null;
  assignedToId?: number | null;
  areaId?: number | null;
  subareaId?: number | null;
  priorityId?: number | null;

  //relations
  inferences: Inference[];
  area?: IdName;
  subarea?: IdName;
  priority?: IdName;
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
    prevStageId: number;
    nextStageId: number;
    type: string;
  };
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
  description: string;
  cost: number;
  status: OTS_STATUS;
  note: string;
  executionDate: string | Date;
}

export enum OTS_STATUS {
  OPENED = 'OPENED',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}
