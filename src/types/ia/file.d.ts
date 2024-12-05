export interface IModelFile {
  id: number;
  name: string;
  type: string;
  size: string;
  status: string;
  model: any;
  url: string;
  aimodel_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
