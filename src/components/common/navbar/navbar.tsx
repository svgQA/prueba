import { type FunctionComponent } from 'preact';
import { type INavbarProps } from './interface';

export const Navbar: FunctionComponent<INavbarProps> = ({
  id,
  name,
}: INavbarProps) => {
  return <div id={id} name={name}></div>;
};
