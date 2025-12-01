export interface IShiftReportRequest {
  shiftId: number;
  type: ReportType;
  shift?: any;
}

export interface IMemoReportRequest {
  memoId: number;
  type: ReportType;
  memo?: any;
  history?: any;
}

export interface IResponseReportRequest {
  responseId: string;
  type: ReportType;
  structure?: any;
  user?: any;
  company?: any;
}
