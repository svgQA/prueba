import { IOption } from '../multi/interface';

export interface INotificationsProps {
  icon: string;
  iconSize?: 'sm' | 'xsm' | 'xs' | 'xxs';
}

export interface INotification extends IOption {
  id?: string;
  id_message?: string;
  value: number | string;
  name?: string;
  redirect?: string;
  status?: string;
}
