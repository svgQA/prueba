import { type FunctionComponent } from 'preact';
import { type ISidebarProps } from './interface';

export const SSidebar: FunctionComponent<ISidebarProps> = ({
  id,
}: ISidebarProps) => {
  return (
    <aside>
      <nav id={id}></nav>
    </aside>
  );
};
