import { type FunctionComponent } from 'preact';
import { type IAlertProps } from './interface';

export const Alert: FunctionComponent<IAlertProps> = ({
  id,
  name,
}: IAlertProps) => {
  return <div id={id} name={name}></div>;
};
