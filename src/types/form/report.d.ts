import { IPresignedRequest } from '../file';

export interface IReport {
  id?: number;
  title: string;
  description?: string;

  header: boolean;
  footer: boolean;
  pageBreak: boolean;
  flaggedItems: boolean;
  actions: boolean;
  disclaimer: boolean;
  mediaSummary: boolean;
  pdfSize: string;
  thumbnailSize: string;

  coverPage?: IPresignedRequest;
  logoPage?: IPresignedRequest;
  formId?: number;
}
