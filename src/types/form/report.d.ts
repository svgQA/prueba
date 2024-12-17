export interface IReport {
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

  coverPage?: string;
  logoPage?: string;
  formId?: number;
}
