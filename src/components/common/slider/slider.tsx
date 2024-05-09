import { type FunctionComponent } from 'preact';
import { type ISidebarProps } from './interface';

export const Slider: FunctionComponent<ISidebarProps> = ({
  id,
  name,
}: ISidebarProps) => {
  return <div id={id} name={name}></div>;
};
