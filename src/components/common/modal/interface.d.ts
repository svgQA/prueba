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
  expandable?: boolean;
  width?: string;
  transparent?: boolean;
  shadowed?: boolean;
  position?: 'absolute' | 'relative' | 'fixed';
  theme?: boolean;
  setExpandable?: any;
}

export interface Corner {
  left: number;
  top: number;
}
