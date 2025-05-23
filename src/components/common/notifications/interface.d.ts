import { IOption } from "../multi/interface";

export interface INotificationsProps {
    notifications: INotification[];
    icon: string;
    iconSize?: 'sm' | 'xsm' | 'xs' | 'xxs';
}

export interface INotification extends IOption {
    value: number | string;
    name?: string;
    id?: string;
    redirect?: string;
}