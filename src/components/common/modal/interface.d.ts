import { VNode } from 'preact';
import { IComponentProps } from '../interface';

export interface IModalProps extends IComponentProps {
  open: boolean;
  title?: string;
  onClose?: () => void;
  rounded?: boolean;
  header?: VNode;
  sidebar?: VNode;
  body?: VNode;
}

export interface Corner {
  left: number;
  top: number;
}
