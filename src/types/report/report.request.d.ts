export interface IShiftReportRequest {
  shiftId: string;
  type: ReportType;
}

export interface IMemoReportRequest {
  memoId: string;
  type: ReportType;
}

export interface IResponseReportRequest {
  responseId: string;
  type: ReportType;
  structure?: any;
  user?: any;
  company?: any;
}
