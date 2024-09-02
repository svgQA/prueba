import { VNode } from 'preact';
import { type IComponentProps } from '@/components/utils/interface';

export interface IModalProps extends IComponentProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  rounded?: boolean;
  header?: VNode;
  body?: VNode;
}

export interface Corner {
  left: number;
  top: number;
}
