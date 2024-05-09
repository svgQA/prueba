import { type FunctionComponent } from 'preact';
import { type IModalProps } from './interface';

export const Modal: FunctionComponent<IModalProps> = ({
  id,
  name,
}: IModalProps) => {
  return <div id={id} name={name}></div>;
};
