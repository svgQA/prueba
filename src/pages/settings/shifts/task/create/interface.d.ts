export interface ITask {
  id?: number | string;
  hourStart?: string;
  description?: string;
  name: string;
  companyId?: number;
  formId?: number;
  type: string | IOption;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  createdBy?: string;
  editedBy?: string;
  deletedBy?: string;
  check?: boolean;
  status?: string;
  progress?: number;
  styles?: any;
  start?: string | Date;
  end?: string | Date;
  attachmentType: string;
}
