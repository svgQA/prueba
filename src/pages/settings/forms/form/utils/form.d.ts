export interface IForm {
  id: number;
  title: string;
  description: string;
  category?: string;
  structure: any;
  responses: any[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
