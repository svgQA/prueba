import { IBaseSSE } from '@/utils/network/sse/base';

export interface IPanicProps {
  icon: string;
  iconSize?: 'sm' | 'xsm';
  emitPanic?: (panic: IPanic) => void;
}

export interface IPanic {
  id: string;
  message: string;
  user: any;
  date: string;
  status: string;
  uuid: string;
}

export interface PanicModalProps {
  open: boolean;
  onClose: () => void;
  panic?: IPanic;
}
