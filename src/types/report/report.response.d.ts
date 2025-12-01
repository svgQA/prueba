export interface IOnePdfResponseModel {
  success: boolean;
  data: {
    filename: string;
    mimeType: string;
    buffer: string;
  };
}
