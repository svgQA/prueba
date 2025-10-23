export interface IStages {
    id?: number;
    prompt: any;
    stageName: string;
    executionNotes?: string | null;
    goal?: string | null;
    resultText?: string | null;
    outputFormat?: string | null;
    nextStageId?: number | null;
    prevStageId?: number | null;
    errorStageId?: number | null;
    status: string;
}