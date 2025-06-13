
export interface IPanicProps {
  icon: string;
  iconSize?: 'sm' | 'xsm';
}

export interface IPanic {
  id: string;
  message: string;
  user: any;
  date: string;
  status: string;
}
