import { type FunctionComponent } from 'preact';
import { type IRadioProps } from './interface';

export const Radio: FunctionComponent<IRadioProps> = ({
  id,
  name,
}: IRadioProps) => {
  return <div id={id} name={name}></div>;
};
