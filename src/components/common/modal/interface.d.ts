import { IComponentProps } from '../interface';

export interface IModalProps extends IComponentProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
}

export interface Corner {
  left: number;
  top: number;
}
