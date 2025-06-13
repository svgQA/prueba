import { IPresignedRequest } from '@/types/file';

export interface IDropzoneProps {
  description: string;
  name: string;
  onChange?: (event: KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
  icon?: string;
  accept?: string;
  value?: IPresignedRequest;
}
