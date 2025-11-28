export interface IExcelGenerate {
  header: string;
  data: any[];
}

export interface IBase64DownloadData {
  buffer: string;
  mimeType?: string;
  filename?: string;
}

export interface IBase64DownloadResult {
  data: IBase64DownloadData;
  success?: boolean;
}
