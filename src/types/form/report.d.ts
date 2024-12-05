export interface IReport {
  title: string;
  header: boolean;
  footer: boolean;
  pageBreak: boolean;
  flaggedItems: boolean;
  actions: boolean;
  disclaimer: boolean;
  mediaSummary: boolean;
  pdfSize: string;
  thumbnailSize: string;
}
