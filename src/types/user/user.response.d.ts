export interface IDocumentTypeResponse {
  id: number;
  name: string;
  code: string;
}

interface IDeleteUserResponse {
  ok: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
  };
}
