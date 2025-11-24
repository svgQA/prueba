export interface IStages {
  id?: number;
  stageName: string;
  status: string;
  executionNotes?: string | null;
  goal?: string | null;
  prompt: any;
  resource?: IResourceStage[] | null;
  nextStageId?: number | null;
  prevStageId?: number | null;
  errorStageId?: number | null;
  visibility?: boolean;
}

export interface IResourceStage {
  method: Methods;
  requestUrl: string;
}

export enum Methods {
  GET = 'GET',
  POST = 'POST',
}
