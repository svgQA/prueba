export interface ITask {
  id?: number | string;
  hourStart?: string;
  description?: string;
  name: string;
  formId?: number;
  responseId?: string;
  type: string | IOption;
  check?: boolean;
  status?: string;
  progress?: number;
  start?: string | Date;
  end?: string | Date;
  attachmentType?: string;
  styles?: any;
  companyId?: number;
  // createdAt?: string;
  // updatedAt?: string;
  // deletedAt?: string;
  // createdBy?: string;
  // editedBy?: string;
  // deletedBy?: string;
}
