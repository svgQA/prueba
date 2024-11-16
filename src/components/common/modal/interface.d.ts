import { VNode } from 'preact';
import { type IComponentProps } from '@/components/utils/interface';
import { PropsWithChildren } from 'preact/compat';

export interface IModalProps extends IComponentProps, PropsWithChildren {
  open: boolean;
  title?: string;
  onClose?: () => void;
  rounded?: boolean;
  header?: VNode;
  footer?: VNode;
}

export interface Corner {
  left: number;
  top: number;
}
