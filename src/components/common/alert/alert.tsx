import { type FunctionComponent } from 'preact';
import { type IAlertProps } from './interface';

export const Alert: FunctionComponent<IAlertProps> = ({ id }: IAlertProps) => {
  return <div id={id}></div>;
};
