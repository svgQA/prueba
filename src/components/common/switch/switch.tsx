import { type FunctionComponent } from 'preact';
import { type ISwitchProps } from './interface';

export const Switch: FunctionComponent<ISwitchProps> = ({
  id,
  name,
}: ISwitchProps) => {
  return <div id={id} name={name}></div>;
};
