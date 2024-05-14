import { IComponentProps } from '../interface';

export interface IModalProps extends IComponentProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  rounded?: boolean;
}

export interface Corner {
  left: number;
  top: number;
}
