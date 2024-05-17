import { type FunctionComponent } from 'preact';
import { type INavbarProps } from './interface';
import { Link } from 'wouter';

export const Navbar: FunctionComponent<INavbarProps> = ({
  id,
  name,
  menus,
  logo,
  actions,
}: INavbarProps) => {
  return (
    <nav
      id={id}
      name={name}
      className='flex flex-row justify-between w-full h-10 content-center absolute bg-green-200'
    >
      <span className='px-5 content-center bg-red-200'>{logo}</span>
      <span className='px-5 content-center bg-yellow-100'>{actions}</span>
      <ul class='flex flex-row px-3 items-center text-center bg-blue-100'>
        {menus.map((menu) => (
          <li key={`navbar-menu-${menu.to}`} className='px-2'>
            <Link to={menu.to}>{menu.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
