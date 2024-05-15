import { type FunctionComponent } from 'preact';
import { type ISidebarProps } from './interface';

export const SSidebar: FunctionComponent<ISidebarProps> = ({
  id,
  name,
}: ISidebarProps) => {
  return (
    <aside>
      <nav id={id} name={name}></nav>
    </aside>
  );
};
